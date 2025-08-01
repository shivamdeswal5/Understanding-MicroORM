import {
    INestApplication,
    HttpStatus,
    ValidationPipe,
    BadRequestException,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { Test } from '@nestjs/testing';
  import * as request from 'supertest';
  
  import { MarkTodoIncompleteController } from '../../../../src/features/todo/mark-todo-incomplete/mark-todo-incomplete.controller';
  import { MarkTodoIncompleteHandler } from '../../../../src/features/todo/mark-todo-incomplete/mark-todo-incomplete.handler';
  import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';
  
  describe('Test case for MarkTodoIncompleteController (integration-style)', () => {
    let app: INestApplication;
    let handler: jest.Mocked<MarkTodoIncompleteHandler>;
  
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [MarkTodoIncompleteController],
        providers: [
          {
            provide: MarkTodoIncompleteHandler,
            useValue: {
              handle: jest.fn(),
            },
          },
        ],
      }).compile();
  
      handler = moduleRef.get(MarkTodoIncompleteHandler);
  
      app = moduleRef.createNestApplication();
      const httpAdapterHost = app.get(HttpAdapterHost);
  
      app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
  
      await app.init();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    describe('PUT /todos/:uuid/mark-incomplete', () => {
      it('should return 200 and success message when todo is marked incomplete', async () => {
        const uuid = 'b84c62d0-b964-40c0-9c66-7a58fbee2f01';
        const response = {
          message: 'Todo has been marked as Incompleted.',
          todo: {
            uuid,
            title: 'Sample',
            description: 'Sample description',
            completed: false,
          },
        };
  
        handler.handle.mockResolvedValue(response);
  
        const res = await request(app.getHttpServer())
          .put(`/todos/${uuid}/mark-incomplete`)
          .expect(HttpStatus.OK);
  
        expect(res.body).toEqual(response);
        expect(handler.handle).toHaveBeenCalledWith(uuid);
      });
  
      it('should return 400 when uuid is invalid', async () => {
        const invalidUuid = 'invalid-uuid';
  
        const res = await request(app.getHttpServer())
          .put(`/todos/${invalidUuid}/mark-incomplete`)
          .expect(HttpStatus.BAD_REQUEST);
  
        expect(handler.handle).not.toHaveBeenCalled();
        expect(res.body).toBeDefined();
        expect(res.body.detail).toContain('Validation failed (uuid is expected)');
      });
  
      it('should return 400 when todo is not found', async () => {
        const uuid = 'b84c62d0-b964-40c0-9c66-7a58fbee2f01';
  
        handler.handle.mockRejectedValue(
          new BadRequestException(`Todo with UUID ${uuid} not found`),
        );
  
        const res = await request(app.getHttpServer())
          .put(`/todos/${uuid}/mark-incomplete`)
          .expect(HttpStatus.BAD_REQUEST);
  
        expect(res.body).toBeDefined();
        expect(res.body.detail).toContain(`Todo with UUID ${uuid} not found`);
      });
    });
  });
  
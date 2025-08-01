import {
    INestApplication,
    HttpStatus,
    ValidationPipe,
    BadRequestException,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { Test } from '@nestjs/testing';
  import * as request from 'supertest';
  
  import { UpdateTodoController } from '../../../../src/features/todo/update-todo/update-todo.controller';
  import { UpdateTodoHandler } from '../../../../src/features/todo/update-todo/update-todo.handler';
  import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';
  import { UpdateTodoDto } from '../../../../src/features/todo/update-todo/update-todo.dto';
  
  describe('UpdateTodoController (integration-style)', () => {
    let app: INestApplication;
    let handler: jest.Mocked<UpdateTodoHandler>;
  
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [UpdateTodoController],
        providers: [
          {
            provide: UpdateTodoHandler,
            useValue: {
              handle: jest.fn(),
            },
          },
        ],
      }).compile();
  
      handler = moduleRef.get(UpdateTodoHandler);
  
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
  
    describe('PUT /todos/:uuid', () => {
      it('should return 200 when todo is updated', async () => {
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const dto: UpdateTodoDto = {
          title: 'Updated Title',
          description: 'Updated Description',
        };
  
        handler.handle.mockResolvedValue({ message: 'Todo updated successfully' });
  
        const res = await request(app.getHttpServer())
          .put(`/todos/${uuid}`)
          .send(dto)
          .expect(HttpStatus.OK);
  
        expect(res.body).toEqual({ message: 'Todo updated successfully' });
        expect(handler.handle).toHaveBeenCalledWith(uuid, dto);
      });
  
      it('should return 400 if uuid is invalid', async () => {
        const res = await request(app.getHttpServer())
          .put('/todos/invalid-uuid')
          .send({ title: 'Test', description: 'Test desc' })
          .expect(HttpStatus.BAD_REQUEST);
  
        expect(handler.handle).not.toHaveBeenCalled();
        expect(res.body.detail).toContain('Validation failed');
      });
  
      it('should return 400 if todo not found', async () => {
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
  
        handler.handle.mockRejectedValue(
          new BadRequestException(`Todo with UUID ${uuid} not found`),
        );
  
        const res = await request(app.getHttpServer())
          .put(`/todos/${uuid}`)
          .send({ title: 'New Title', description: 'New Description' })
          .expect(HttpStatus.BAD_REQUEST);
  
        expect(res.body.detail).toContain(`Todo with UUID ${uuid} not found`);
      });
    });
  });
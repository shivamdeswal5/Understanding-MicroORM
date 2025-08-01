import {
    INestApplication,
    HttpStatus,
    NotFoundException,
    ValidationPipe,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { Test } from '@nestjs/testing';
  import * as request from 'supertest';
  import { DeleteTodoController } from '../../../../src/features/todo/delete-todo/delete-todo.controller';
  import { DeleteTodoHandler } from '../../../../src/features/todo/delete-todo/delete.todo.handler';
  import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';
  
  describe('Test case for DeleteTodoController (integration-style)', () => {
    let app: INestApplication;
    let handler: jest.Mocked<DeleteTodoHandler>;
  
    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [DeleteTodoController],
        providers: [
          {
            provide: DeleteTodoHandler,
            useValue: {
              handle: jest.fn(),
            },
          },
        ],
      }).compile();
  
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
      handler = moduleRef.get(DeleteTodoHandler);
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('DELETE /todos/:uuid', () => {
      it('should return 200 and success message when todo is deleted', async () => {
        const uuid = 'some-valid-uuid';
        handler.handle.mockResolvedValue({ message: 'Todo deleted successfully' });
  
        const res = await request(app.getHttpServer())
          .delete(`/todos/${uuid}`)
          .expect(HttpStatus.OK);
  
        expect(res.body).toEqual({ message: 'Todo deleted successfully' });
        expect(handler.handle).toHaveBeenCalledWith(uuid);
      });
  
    });
  });
  
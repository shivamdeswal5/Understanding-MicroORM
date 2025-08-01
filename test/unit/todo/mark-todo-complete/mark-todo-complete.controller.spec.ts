import { INestApplication, HttpStatus, ValidationPipe, NotFoundException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { MarkTodoCompleteController } from '../../../../src/features/todo/mark-todo-complete/mark-todo-complete.controller';
import { MarkTodoCompleteHandler } from '../../../../src/features/todo/mark-todo-complete/mark-todo-complete.handler';
import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';

describe('Test case for MarkTodoCompleteController (integration-style)', () => {
  let app: INestApplication;
  let handler: jest.Mocked<MarkTodoCompleteHandler>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MarkTodoCompleteController],
      providers: [
        {
          provide: MarkTodoCompleteHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(MarkTodoCompleteHandler);

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

  describe('PUT /todos/:uuid/mark-complete', () => {
    it('should return 200 and success message when todo is marked complete', async () => {
      const uuid = '7c542b3b-6784-45cf-b6b3-b98ef2616c98';
      const response = {
        message: 'Todo has been marked as completed.',
        todo: {
          uuid,
          title: 'Sample',
          description: 'Sample description',
          completed: true,
        },
      };
      handler.handle.mockResolvedValue(response);

      const res = await request(app.getHttpServer())
        .put(`/todos/${uuid}/mark-complete`)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual(response);
      expect(handler.handle).toHaveBeenCalledWith(uuid);
    });

    it('should return 404 when todo is not found', async () => {
      const uuid = 'c1aa2d8e-bb60-4f08-88db-abcdef123456';
      const errorMsg = `Todo with UUID ${uuid} not found`;
      handler.handle.mockRejectedValue(new NotFoundException(errorMsg));

      const res = await request(app.getHttpServer())
        .put(`/todos/${uuid}/mark-complete`)
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body).toBeDefined();
      expect(res.body.detail).toContain(errorMsg);
    });

  });
});

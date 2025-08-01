import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ListTodosController } from '../../../../src/features/todo/list-todos/list-todos.controller';
import { ListTodosHandler } from '../../../../src/features/todo/list-todos/list-todos.handler';
import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';

describe('Test case for ListTodosController (integration-style)', () => {
  let app: INestApplication;
  let handler: jest.Mocked<ListTodosHandler>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ListTodosController],
      providers: [
        {
          provide: ListTodosHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(ListTodosHandler);

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

  describe('GET /todos', () => {
    it('should return 200 and paginated todos when valid query params are provided', async () => {
      const query = {
        page: 1,
        limit: 10,
        title: 'test',
        completed: true,
      };

      const response = {
        data: [
          {
            uuid: 'todo-uuid',
            title: 'test title',
            description: 'desc',
            completed: true,
            user: {
              uuid: 'user-uuid',
              name: 'John Doe',
            },
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      };

      handler.handle.mockResolvedValue(response as any);

      const res = await request(app.getHttpServer())
        .get('/todos')
        .query(query)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual(response);
      expect(handler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          title: 'test',
          completed: true,
        }),
      );
    });

    it('should return 400 if invalid query params are provided', async () => {
      const invalidQuery = {
        page: 'not-a-number',
        limit: -1,
      };

      await request(app.getHttpServer())
        .get('/todos')
        .query(invalidQuery)
        .expect(HttpStatus.BAD_REQUEST);

      expect(handler.handle).not.toHaveBeenCalled();
    });
  });
});

import { INestApplication, ValidationPipe, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { GetUserController } from '../../../../src/features/user/get-user/get-user.controller';
import { GetUserHandler } from '../../../../src/features/user/get-user/get-user.handler';
import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';
import { Collection } from '@mikro-orm/core';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('Test case for GetUserController (integration-style)', () => {
  let app: INestApplication;
  let handler: jest.Mocked<GetUserHandler>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GetUserController],
      providers: [
        {
          provide: GetUserHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(GetUserHandler);
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

  describe('GET /users/:uuid', () => {
    it('should return the user for a valid uuid', async () => {
      const uuid = '9a3b614e-3b9e-4bb5-9a9d-dab539ed5145';
      const expectedUser = {
        uuid,
        first_name: 'Shivam',
        last_name: 'Deswal',
        email: 'shivam@gmail.com',
        id: 1,
        todos: new Collection<Todo>([]),
        created_at: new Date(),
        updated_at: new Date(),
      };

      handler.handle.mockResolvedValue(expectedUser);

      const res = await request(app.getHttpServer())
        .get(`/users/${uuid}`)
        .expect(HttpStatus.OK);

      expect(res.body).toMatchObject({
        uuid,
        first_name: 'Shivam',
        last_name: 'Deswal',
        email: 'shivam@gmail.com',
        id: 1,
      });
      expect(handler.handle).toHaveBeenCalledWith(uuid);
    });

    it('should return 400 if uuid is invalid', async () => {
      await request(app.getHttpServer())
        .get('/users/invalid-uuid')
        .expect(HttpStatus.BAD_REQUEST);

      expect(handler.handle).not.toHaveBeenCalled();
    });
  });
});

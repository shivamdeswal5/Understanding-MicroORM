import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserController } from '../../../../src/features/user/update-user/update-user.controller';
import { UpdateUserHandler } from '../../../../src/features/user/update-user/update-user.handler';
import { UpdateUserDto } from '../../../../src/features/user/update-user/update-user.dto';
import { NotFoundException, ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as request from 'supertest';
import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';
import { User } from '../../../../src/domain/user/user.entity';
import { Collection } from '@mikro-orm/core';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('UpdateUserController (integration-style)', () => {
  let app: INestApplication;
  let handler: jest.Mocked<UpdateUserHandler>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserController],
      providers: [
        {
          provide: UpdateUserHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(UpdateUserHandler);

    app = moduleRef.createNestApplication();
    const httpAdapter = app.get(HttpAdapterHost);

    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
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

  describe('PUT /users/:uuid', () => {
    const uuid = '9a3b614e-3b9e-4bb5-9a9d-dab539ed5145';
    const dto: UpdateUserDto = {
      first_name: 'Updated',
      last_name: 'User',
      email: 'updated@example.com',
    };

    it('should return updated user when valid data is provided', async () => {
      const updatedUser: any = {
        id: 1,
        uuid,
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        created_at: new Date(),
        updated_at: new Date(),
        todos: new Collection<Todo>([]),
      };

      handler.handle.mockResolvedValue(updatedUser);

      const res = await request(app.getHttpServer())
        .put(`/users/${uuid}`)
        .send(dto)
        .expect(200);

      expect(res.body).toMatchObject({
        uuid,
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
      });

      expect(handler.handle).toHaveBeenCalledWith(uuid, dto);
    });

    it('should return 400 if UUID is invalid', async () => {
      await request(app.getHttpServer())
        .put('/users/invalid-uuid')
        .send(dto)
        .expect(400);

      expect(handler.handle).not.toHaveBeenCalled();
    });
  });
});

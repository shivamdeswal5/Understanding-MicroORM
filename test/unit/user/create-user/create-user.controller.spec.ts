import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateUserController } from '../../../../src/features/user/create-user/create-user.controller';
import { CreateUserHandler } from '../../../../src/features/user/create-user/create-user.handler';
import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';
import { UserMother } from '../user.mother';

describe('Test case for CreateUserController (integration-style)', () => {
  let app: INestApplication;
  let handler: jest.Mocked<CreateUserHandler>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: CreateUserHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(CreateUserHandler);

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

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should return 201 and success message when valid data is provided', async () => {
      const dto = UserMother.validUserData();
      handler.handle.mockResolvedValue({ message: 'User created successfully' });

      const res = await request(app.getHttpServer())
        .post('/users')
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(res.body).toEqual({ message: 'User created successfully' });
      expect(handler.handle).toHaveBeenCalledWith(expect.objectContaining(dto));
    });

    it('should return 400 if validation fails', async () => {
      const invalidDto = { first_name: '', last_name: '', email: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(handler.handle).not.toHaveBeenCalled();
    });
  });
});

import { INestApplication, ValidationPipe, HttpStatus, BadRequestException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DeleteUserController } from '../../../../src/features/user/delete-user/delete-user.controller';
import { DeleteUserHandler } from '../../../../src/features/user/delete-user/delete-user.handler';
import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';

describe('Test case for DeleteUserController (integration-style)', () => {
  let app: INestApplication;
  let handler: jest.Mocked<DeleteUserHandler>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: DeleteUserHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(DeleteUserHandler);

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

  describe('DELETE /users/:uuid', () => {
    it('should return 200 when user is deleted', async () => {
      const uuid = '9a3b614e-3b9e-4bb5-9a9d-dab539ed5145';
      const response = { message: 'User deleted successfully' };

      handler.handle.mockResolvedValue(response);

      const res = await request(app.getHttpServer())
        .delete(`/users/${uuid}`)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual(response);
      expect(handler.handle).toHaveBeenCalledWith(uuid);
    });

    it('should return 400 if uuid is invalid', async () => {
      await request(app.getHttpServer())
        .delete('/users/invalid-uuid')
        .expect(HttpStatus.BAD_REQUEST);

      expect(handler.handle).not.toHaveBeenCalled();
    });
  });
});

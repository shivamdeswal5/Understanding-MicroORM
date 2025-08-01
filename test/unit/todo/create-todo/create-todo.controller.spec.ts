import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateTodoController } from '../../../../src/features/todo/create-todo/create-todo.controller';
import { CreateTodoHandler } from '../../../../src/features/todo/create-todo/create-todo.handler';
import { AllExceptionsFilter } from '../../../../src/infrastructure/http/exceptions/all-exception-filter';
import { TodoMother } from '../todo.mother';
import { v4 as uuid } from 'uuid';

describe('Test case for CreateTodoController (integration-style)', () => {
  let app: INestApplication;
  let handler: jest.Mocked<CreateTodoHandler>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CreateTodoController],
      providers: [
        {
          provide: CreateTodoHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(CreateTodoHandler);

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

  describe('POST /todos', () => {
    it('should return 201 and success message when valid data is provided', async () => {
        const baseDto = TodoMother.validTodoData();
      
        const dto = {
          title: baseDto.title,
          description: baseDto.description ?? '',
          user_uuid: uuid(), // ✅ valid UUID
          completed: false,  // ✅ valid boolean
        };
      
        handler.handle.mockResolvedValue({ message: 'Todo created successfully' });
      
        const res = await request(app.getHttpServer())
          .post('/todos')
          .send(dto)
          .expect(HttpStatus.CREATED); 
      
        expect(res.body).toEqual({ message: 'Todo created successfully' });
        expect(handler.handle).toHaveBeenCalledWith(expect.objectContaining(dto));
      });

    it('should return 400 if validation fails', async () => {
      const invalidDto = {
        title: '',                  
        description: '',            
        completed: 'not-a-boolean', 
        user_uuid: 'invalid-uuid',  
      };

      await request(app.getHttpServer()) 
        .post('/todos')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(handler.handle).not.toHaveBeenCalled();
    });
  });
});

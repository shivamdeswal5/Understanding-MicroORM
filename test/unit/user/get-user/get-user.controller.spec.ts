import { Test, TestingModule } from '@nestjs/testing';
import { GetUserController } from '../../../../src/features/user/get-user/get-user.controller';
import { GetUserHandler } from '../../../../src/features/user/get-user/get-user.handler';
import { Collection } from '@mikro-orm/core';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('Test case for GetUserController', () => {
  let controller: GetUserController;
  let handler: GetUserHandler;

  beforeEach(async () => {
    const mockHandler = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetUserController],
      providers: [
        {
          provide: GetUserHandler,
          useValue: mockHandler,
        },
      ],
    }).compile();

    controller = module.get(GetUserController);
    handler = module.get(GetUserHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user for a valid uuid', async () => {
    const uuid = 'abc-123';
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

    jest.spyOn(handler, 'handle').mockResolvedValue(expectedUser);

    const result = await controller.handle(uuid);

    expect(handler.handle).toHaveBeenCalledWith(uuid);
    expect(result).toEqual(expectedUser);
  });

  it('should return null if user not found (handler returns null)', async () => {
    const uuid = 'not-found-uuid';
    jest.spyOn(handler, 'handle').mockResolvedValue(null);

    const result = await controller.handle(uuid);

    expect(handler.handle).toHaveBeenCalledWith(uuid);
    expect(result).toBeNull();
  });
});

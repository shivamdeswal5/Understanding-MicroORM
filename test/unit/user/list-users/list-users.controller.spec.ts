import { Test, TestingModule } from '@nestjs/testing';
import { ListUserController } from '../../../../src/features/user/list-users/list-users.controller';
import { ListUsersHandler } from '../../../../src/features/user/list-users/list-users.handler';
import { ListUsersDto } from '../../../../src/features/user/list-users/list-users.dto';
import { Collection } from '@mikro-orm/core';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('Test case for ListUserController', () => {
  let controller: ListUserController;
  let handler: ListUsersHandler;

  beforeEach(async () => {
    const mockHandler = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListUserController],
      providers: [
        {
          provide: ListUsersHandler,
          useValue: mockHandler,
        },
      ],
    }).compile();

    controller = module.get(ListUserController);
    handler = module.get(ListUsersHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call ListUsersHandler with DTO and return response', async () => {
    const dto: ListUsersDto = {
      page: 1,
      limit: 10,
      search: 'test',
    };

    const expectedResponse = {
      data: [{
        uuid: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        id: 1,
        todos: new Collection<Todo>([]),
        created_at: new Date(),
        updated_at: new Date(),
      }],
      total: 1,
      page: 1,
      limit: 10,
    };

    jest.spyOn(handler, 'handle').mockResolvedValue(expectedResponse);

    const result = await controller.listUsers(dto);

    expect(handler.handle).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(result).toEqual(expectedResponse);
  });

  it('should default to empty response if no search', async () => {
    const dto: ListUsersDto = { page: 1, limit: 5 };

    const expectedResponse = {
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    };

    jest.spyOn(handler, 'handle').mockResolvedValue(expectedResponse);

    const result = await controller.listUsers(dto);

    expect(handler.handle).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(result).toEqual(expectedResponse);
  });
});

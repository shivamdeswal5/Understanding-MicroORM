import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserController } from '../../../../src/features/user/update-user/update-user.controller';
import { UpdateUserHandler } from '../../../../src/features/user/update-user/update-user.handler';
import { UpdateUserDto } from '../../../../src/features/user/update-user/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../../../src/domain/user/user.entity';
import { Collection } from '@mikro-orm/core';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('Test case for UpdateUserController', () => {
  let controller: UpdateUserController;
  let handler: UpdateUserHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    controller = module.get(UpdateUserController);
    handler = module.get(UpdateUserHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handler and return updated user', async () => {
    const uuid = 'abc-123';
    const dto: UpdateUserDto = {
      first_name: 'New',
      last_name: 'Name',
      email: 'new@mail.com',
    };

    const updatedUser: User = {
        id: 1,
        uuid,
        first_name: 'New',
        last_name: 'Name',
        email: 'new@mail.com',
        created_at: new Date(),
        updated_at: new Date(),
        todos: new Collection<Todo>([]),
      };

    jest.spyOn(handler, 'handle').mockResolvedValue(updatedUser);

    const result = await controller.handle(uuid, dto);

    expect(handler.handle).toHaveBeenCalledWith(uuid, dto);
    expect(result).toEqual(updatedUser);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const uuid = 'not-found';
    const dto: UpdateUserDto = {
      first_name: 'X',
      last_name: 'Y',
      email: 'x@y.com',
    };

    jest.spyOn(handler, 'handle').mockRejectedValue(new NotFoundException('User not found'));

    await expect(controller.handle(uuid, dto)).rejects.toThrow(NotFoundException);
    expect(handler.handle).toHaveBeenCalledWith(uuid, dto);
  });
});

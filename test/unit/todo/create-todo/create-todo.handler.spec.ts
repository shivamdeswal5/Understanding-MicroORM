import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoHandler } from '../../../../src/features/todo/create-todo/create-todo.handler';
import { CreateTodoCommand } from '../../../../src/features/todo/create-todo/create-todo-command';
import { UserRepository } from '../../../../src/infrastructure/repository/user/user.repository';
import { TodoRepository } from '../../../../src/infrastructure/repository/todo/todo.repository';
import { NotFoundException } from '@nestjs/common';
import { UserMother } from '../../user/user.mother';
import { TodoMother } from '../todo.mother';

describe('Test case for CreateTodoHandler', () => {
  let handler: CreateTodoHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let todoRepository: jest.Mocked<TodoRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTodoHandler,
        {
          provide: UserRepository,
          useValue: {
            findOneByUuid: jest.fn(),
          },
        },
        {
          provide: TodoRepository,
          useValue: {
            createTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateTodoHandler>(CreateTodoHandler);
    userRepository = module.get(UserRepository);
    todoRepository = module.get(TodoRepository);
  });

  it('should create a todo when user exists', async () => {
    const user = UserMother.validUser();
    const todo = TodoMother.validTodo({ user });

    const command = new CreateTodoCommand(
      todo.title,
      todo.description,
      user.uuid,
      todo.completed,
    );

    userRepository.findOneByUuid.mockResolvedValue(user);
    todoRepository.createTodo.mockResolvedValue(todo);

    const result = await handler.handle(command);

    expect(userRepository.findOneByUuid).toHaveBeenCalledWith(user.uuid);
    expect(todoRepository.createTodo).toHaveBeenCalledWith({
      title: command.title,
      description: command.description,
      completed: command.completed,
      user,
    });

    expect(result).toEqual(todo);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const command = new CreateTodoCommand('Task', 'Desc', 'non-existent-uuid', false);

    userRepository.findOneByUuid.mockResolvedValue(null);

    await expect(handler.handle(command)).rejects.toThrow(NotFoundException);
    expect(userRepository.findOneByUuid).toHaveBeenCalledWith('non-existent-uuid');
    expect(todoRepository.createTodo).not.toHaveBeenCalled();
  });
});

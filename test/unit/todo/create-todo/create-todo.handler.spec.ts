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

  it('should return success message when todo is created and user exists', async () => {
    const user = UserMother.validUser();
    const todoData = TodoMother.validCreateCommandData({ user_uuid: user.uuid });
  
    const command = new CreateTodoCommand(
      todoData.title,
      todoData.description,
      todoData.user_uuid,
      todoData.completed,
    );
  
    userRepository.findOneByUuid.mockResolvedValue(user);
    todoRepository.createTodo.mockResolvedValue(TodoMother.validTodo({ user })); 
  
    const result = await handler.handle(command);
  
    expect(userRepository.findOneByUuid).toHaveBeenCalledWith(user.uuid);
    expect(todoRepository.createTodo).toHaveBeenCalledWith({
      title: command.title,
      description: command.description,
      completed: command.completed,
      user,
    });
  
    expect(result).toEqual({ message: 'Todo created successfully' });
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const command = new CreateTodoCommand('Task', 'Desc','non-existent-uuid',false);

    userRepository.findOneByUuid.mockResolvedValue(null);

    await expect(handler.handle(command)).rejects.toThrow(NotFoundException);
    expect(userRepository.findOneByUuid).toHaveBeenCalledWith('non-existent-uuid');
    expect(todoRepository.createTodo).not.toHaveBeenCalled();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTodoHandler } from '../../../../src/features/todo/delete-todo/delete.todo.handler';
import { TodoRepository } from '../../../../src/infrastructure/repository/todo/todo.repository';
import { NotFoundException } from '@nestjs/common';
import { TodoMother } from '../todo.mother';

describe('Test case for DeleteTodoHandler', () => {
  let handler: DeleteTodoHandler;
  let todoRepository: jest.Mocked<TodoRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTodoHandler,
        {
          provide: TodoRepository,
          useValue: {
            findOneByUuid: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteTodoHandler>(DeleteTodoHandler);
    todoRepository = module.get(TodoRepository);
  });

  it('should delete the todo if it exists', async () => {

    const todo = TodoMother.validTodo();
    const uuid = 'valid-todo-uuid';

    todoRepository.findOneByUuid.mockResolvedValue(todo);
    todoRepository.remove.mockResolvedValue(undefined);

    const result = await handler.handle(uuid);

    expect(todoRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
    expect(todoRepository.remove).toHaveBeenCalledWith(todo);
    expect(result).toEqual({ message: 'Todo deleted successfully' });
  });

  it('should throw NotFoundException if todo does not exist', async () => {
    const uuid = 'non-existent-uuid';
    todoRepository.findOneByUuid.mockResolvedValue(null);

    await expect(handler.handle(uuid)).rejects.toThrow(NotFoundException);
    expect(todoRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
    expect(todoRepository.remove).not.toHaveBeenCalled();
  });
});

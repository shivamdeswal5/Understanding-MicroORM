import { NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { MarkTodoCompleteHandler } from '../../../../src/features/todo/mark-todo-complete/mark-todo-complete.handler';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('MarkTodoCompleteHandler', () => {
  let handler: MarkTodoCompleteHandler;
  let em: jest.Mocked<EntityManager>;

  beforeEach(() => {
    em = {
      findOne: jest.fn(),
      flush: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    handler = new MarkTodoCompleteHandler(em);
  });

  it('should mark todo as completed and return success message', async () => {
    const mockTodo = {
      uuid: 'valid-uuid',
      title: 'Sample Title',
      description: 'Sample Description',
      completed: false,
      markAsCompleted: jest.fn(function () {
        this.completed = true;
      }),
    } as unknown as Todo;

    em.findOne.mockResolvedValue(mockTodo);

    const result = await handler.handle('valid-uuid');

    expect(mockTodo.markAsCompleted).toHaveBeenCalled();
    expect(em.flush).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Todo has been marked as completed.',
      todo: {
        uuid: mockTodo.uuid,
        title: mockTodo.title,
        description: mockTodo.description,
        completed: true,
      },
    });
  });

  it('should return already completed message if todo was already completed', async () => {
    const mockTodo = {
      uuid: 'already-completed-uuid',
      title: 'Done',
      description: 'Already done',
      completed: true,
      markAsCompleted: jest.fn(),
    } as unknown as Todo;

    em.findOne.mockResolvedValue(mockTodo);

    const result = await handler.handle('already-completed-uuid');

    expect(mockTodo.markAsCompleted).toHaveBeenCalled();
    expect(em.flush).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Todo was already marked as completed.',
      todo: {
        uuid: mockTodo.uuid,
        title: mockTodo.title,
        description: mockTodo.description,
        completed: true,
      },
    });
  });

  it('should throw NotFoundException if todo is not found', async () => {
    em.findOne.mockResolvedValue(null);

    await expect(handler.handle('non-existent-uuid')).rejects.toThrow(
      new NotFoundException('Todo with UUID non-existent-uuid not found'),
    );

    expect(em.flush).not.toHaveBeenCalled();
  });
});

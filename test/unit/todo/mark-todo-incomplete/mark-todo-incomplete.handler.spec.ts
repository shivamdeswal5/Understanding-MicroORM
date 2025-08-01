import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { MarkTodoIncompleteHandler } from '../../../../src/features/todo/mark-todo-incomplete/mark-todo-incomplete.handler';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('MarkTodoIncompleteHandler (unit)', () => {
  let handler: MarkTodoIncompleteHandler;
  let em: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    em = {
      findOne: jest.fn(),
      flush: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        MarkTodoIncompleteHandler,
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    handler = moduleRef.get(MarkTodoIncompleteHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return message when todo was already completed', async () => {
    const uuid = 'mock-uuid';
    const todo: Partial<Todo> = {
      uuid,
      title: 'Test Todo',
      description: 'Test Description',
      completed: true,
      unmarkCompleted: jest.fn(function () {
        this.completed = false;
      }),
    };

    em.findOne.mockResolvedValue(todo as Todo);

    const result = await handler.handle(uuid);

    expect(todo.unmarkCompleted).toHaveBeenCalled();
    expect(em.flush).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Todo was already marked as Incompleted.',
      todo: {
        uuid,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      },
    });
  });

  it('should return message when todo was not completed', async () => {
    const uuid = 'mock-uuid';
    const todo: Partial<Todo> = {
      uuid,
      title: 'Another Todo',
      description: 'Another description',
      completed: false,
      unmarkCompleted: jest.fn(function () {
        this.completed = false;
      }),
    };

    em.findOne.mockResolvedValue(todo as Todo);

    const result = await handler.handle(uuid);

    expect(todo.unmarkCompleted).toHaveBeenCalled();
    expect(em.flush).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Todo has been marked as Incompleted.',
      todo: {
        uuid,
        title: 'Another Todo',
        description: 'Another description',
        completed: false,
      },
    });
  });

  it('should throw NotFoundException if todo not found', async () => {
    const uuid = 'non-existent-uuid';
    em.findOne.mockResolvedValue(null);

    await expect(handler.handle(uuid)).rejects.toThrow(
      new NotFoundException(`Todo with UUID ${uuid} not found`),
    );

    expect(em.flush).not.toHaveBeenCalled();
  });
});

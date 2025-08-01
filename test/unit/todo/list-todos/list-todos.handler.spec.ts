import { Test, TestingModule } from '@nestjs/testing';
import { ListTodosHandler } from '../../../../src/features/todo/list-todos/list-todos.handler';
import { EntityManager } from '@mikro-orm/core';
import { TodoMother } from '../todo.mother';
import { ListTodosQuery } from '../../../../src/features/todo/list-todos/list-todos.query';

describe('Test case for ListTodosHandler', () => {
  let handler: ListTodosHandler;
  let em: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTodosHandler,
        {
          provide: EntityManager,
          useValue: {
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListTodosHandler);
    em = module.get(EntityManager);
  });

  it('should return paginated todos with filters', async () => {
    const todos = [TodoMother.validTodo()];
    const total = 1;
    const query = new ListTodosQuery({
      page: 1,
      limit: 10,
      title: 'unit',
      completed: true,
    });

    em.findAndCount.mockResolvedValue([todos, total]);

    const result = await handler.handle(query);

    expect(em.findAndCount).toHaveBeenCalledWith(
      expect.anything(), 
      {
        title: { $ilike: `%unit%` },
        completed: true,
      },
      {
        limit: 10,
        offset: 0,
        populate: ['user'],
        orderBy: { created_at: 'DESC' },
      }
    );

    expect(result).toEqual({
      data: todos,
      meta: {
        total,
        page: 1,
        limit: 10,
      },
    });
  });

  it('should return all todos when no filters provided', async () => {
    const todos = [TodoMother.validTodo()];
    const total = 1;
    const query = new ListTodosQuery({
      page: 2,
      limit: 5,
    });

    em.findAndCount.mockResolvedValue([todos, total]);

    const result = await handler.handle(query);

    expect(em.findAndCount).toHaveBeenCalledWith(
      expect.anything(),
      {},
      {
        limit: 5,
        offset: 5,
        populate: ['user'],
        orderBy: { created_at: 'DESC' },
      }
    );

    expect(result).toEqual({
      data: todos,
      meta: {
        total,
        page: 2,
        limit: 5,
      },
    });
  });
});

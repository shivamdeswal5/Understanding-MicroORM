import { Injectable } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { Todo } from '../../../domain/todo/todo.entity';
import { ListTodosQuery } from './list-todos.query';

@Injectable()
export class ListTodosHandler {
  constructor(private readonly em: EntityManager) {}

  async handle(query: ListTodosQuery) {
    const { page, limit, title, completed } = query;
    const offset = (page - 1) * limit;
    
    const where: FilterQuery<Todo> = {};

    if (typeof completed === 'boolean') {
      where.completed = completed;
    }

    if (title) {
      where.title = { $ilike: `%${title}%` };
    }

    const [todos, total] = await this.em.findAndCount(Todo, where, {
      limit,
      offset,
      populate: ['user'],
      orderBy: { created_at: 'DESC' },
    });

    return {
      data: todos,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}

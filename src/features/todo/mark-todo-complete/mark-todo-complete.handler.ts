import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Todo } from 'src/domain/todo/todo.entity';

@Injectable()
export class MarkTodoCompleteHandler {
  constructor(private readonly em: EntityManager) {}

  async handle(uuid: string) {
    const todo = await this.em.findOne(Todo, { uuid });

    if (!todo) {
      throw new NotFoundException(`Todo with UUID ${uuid} not found`);
    }

    const wasAlreadyCompleted = todo.completed;

    todo.markAsCompleted();
    await this.em.flush();

    return {
      message: wasAlreadyCompleted
        ? 'Todo was already marked as completed.'
        : 'Todo has been marked as completed.',
      todo: {
        uuid: todo.uuid,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      },
    };
  }
}

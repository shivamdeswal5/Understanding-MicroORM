import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Todo } from '../../../domain/todo/todo.entity'; 

@Injectable()
export class MarkTodoIncompleteHandler {

  constructor(private readonly em: EntityManager) {}

  async handle(uuid: string) {
    const todo = await this.em.findOne(Todo, { uuid });

    if (!todo) {
      throw new NotFoundException(`Todo with UUID ${uuid} not found`);
    }

    const wasAlreadyCompleted = todo.completed;

    todo.unmarkCompleted();
    await this.em.flush();

    return {
      message: wasAlreadyCompleted
        ? 'Todo was already marked as Incompleted.'
        : 'Todo has been marked as Incompleted.',
      todo: {
        uuid: todo.uuid,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      },
    };
  }
}

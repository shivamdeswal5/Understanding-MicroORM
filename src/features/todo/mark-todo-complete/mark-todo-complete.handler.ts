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
    todo.markAsCompleted();
    await this.em.flush();
    return todo;
  }
}

import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Todo } from '../../../domain/todo/todo.entity';
import { User } from '../../../domain/user/user.entity';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: EntityRepository<Todo>,

    private readonly em: EntityManager,
  ) {}

  async createTodo(data: { title: string; description: string; completed: boolean; user: User }) {
    const todo = new Todo();
    todo.title = data.title;
    todo.description = data.description;
    todo.completed = data.completed;
    todo.user = data.user;
    this.em.persist(todo);
    await this.em.flush()
    return todo;
  }

  async findOneByUuid(uuid: string): Promise<Todo | null> {
    return this.repository.findOne({ uuid });
  }

  async updateTodo(
    uuid: string,
    dto: Partial<{ title: string; description: string; completed: boolean }>
  ) {
    const todo = await this.repository.findOne({ uuid }, { populate: ['user'] }); 
    if (!todo) return null;
  
    if (dto.title !== undefined) todo.title = dto.title;
    if (dto.description !== undefined) todo.description = dto.description;
    if (dto.completed !== undefined) todo.completed = dto.completed;
  
    await this.em.flush();
    return todo;
  }

  async remove(todo: Todo): Promise<void> {
    this.em.remove(todo);
    await this.em.flush();
  }

}

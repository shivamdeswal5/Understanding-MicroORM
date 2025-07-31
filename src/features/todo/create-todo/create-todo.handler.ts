import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from '../../../infrastructure/repository/todo/todo.repository';
import { UserRepository } from '../../../infrastructure/repository/user/user.repository';
import { CreateTodoCommand } from './create-todo-command';

@Injectable()
export class CreateTodoHandler {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async handle(command: CreateTodoCommand) {
    const { title, description, user_uuid, completed } = command;
    const user = await this.userRepository.findOneByUuid(user_uuid);
    if (!user) {
      throw new NotFoundException(`User with UUID ${user_uuid} not found`);
    }
    return await this.todoRepository.createTodo({
      title: title,
      description: description ?? '',
      completed: completed ?? false,
      user,
    });
  }
}

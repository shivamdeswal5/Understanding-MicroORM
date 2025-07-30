import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from 'src/infrastructure/repository/todo/todo.repository';

@Injectable()
export class DeleteTodoHandler {
  constructor(private readonly todoRepository: TodoRepository) {}

  async handle(uuid: string) {
    const user = await this.todoRepository.findOneByUuid(uuid);
    if (!user) throw new NotFoundException('Todo not found');

    await this.todoRepository.remove(user);

    return { message: 'Todo deleted successfully' };
  }
}

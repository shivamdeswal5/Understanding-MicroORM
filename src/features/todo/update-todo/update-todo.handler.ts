import { Injectable } from '@nestjs/common';
import { UpdateTodoDto } from './update-todo.dto';
import { TodoRepository } from '../../../infrastructure/repository/todo/todo.repository'; 

@Injectable()
export class UpdateTodoHandler {
  constructor(private readonly todoRepository: TodoRepository) {}

  async handle(uuid: string, dto: UpdateTodoDto) {
    await this.todoRepository.updateTodo(uuid, dto);
    return{
      message: 'Todo updated successfully',
    }    
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { CreateTodoDto } from './create-todo.dto';
import { CreateTodoHandler } from './create-todo.handler';
import { CreateTodoCommand } from './create-todo-command';

@Controller('todos')
export class CreateTodoController {
  constructor(private readonly handler: CreateTodoHandler) {}

  @Post()
  async create(@Body() dto: CreateTodoDto) {
    const command = new CreateTodoCommand(
      dto.title,
      dto.description ?? '',
      dto.user_uuid,
      dto.completed ?? false,
    );
    return this.handler.handle(command);
  }
}

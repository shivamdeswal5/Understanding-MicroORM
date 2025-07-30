import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ListTodosHandler } from './list-todos.handler';
import { ListTodosDto } from './list-todos.dto';
import { ListTodosQuery } from  './list-todos.query';

@Controller('todos')
export class ListTodosController {
  constructor(private readonly handler: ListTodosHandler) {}

  @Get()
  async listTodos(@Query() body: ListTodosDto) {
    const query = new ListTodosQuery(body);
    return this.handler.handle(query);
  }
}

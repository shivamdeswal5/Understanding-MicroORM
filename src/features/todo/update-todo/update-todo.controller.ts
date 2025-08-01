import { Controller, Put, Param, Body, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { UpdateTodoHandler } from './update-todo.handler';
import { UpdateTodoDto } from './update-todo.dto';

@Controller('todos')
export class UpdateTodoController {
  constructor(private readonly handler: UpdateTodoHandler) {}

  @Put(':uuid')
  async handle(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateTodoDto) {
    return await this.handler.handle(uuid, dto);

  }
}

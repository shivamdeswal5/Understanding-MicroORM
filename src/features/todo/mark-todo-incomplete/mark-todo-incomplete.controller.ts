import { Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { MarkTodoIncompleteHandler } from './mark-todo-incomplete.handler';

@Controller('todos')
export class MarkTodoIncompleteController {
  constructor(private readonly handler: MarkTodoIncompleteHandler) {}

  @Put(':uuid/mark-incomplete')
  async markIncomplete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.handler.handle(uuid);
  }
}

import { Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { MarkTodoCompleteHandler } from './mark-todo-complete.handler';

@Controller('todos')
export class MarkTodoCompleteController {
  constructor(private readonly handler: MarkTodoCompleteHandler) {}

  @Put(':uuid/mark-complete')
  async markComplete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.handler.handle(uuid);
  }
}
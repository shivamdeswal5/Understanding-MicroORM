import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteTodoHandler } from './delete.todo.handler';

@Controller('todos')
export class DeleteTodoController {
  constructor(private readonly handler: DeleteTodoHandler) {}

  @Delete(':uuid')
  async handle(@Param('uuid') uuid: string) {
    return this.handler.handle(uuid);
  }
}

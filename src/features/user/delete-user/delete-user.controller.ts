import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { DeleteUserHandler } from './delete-user.handler';

@Controller('users')
export class DeleteUserController {
  constructor(private readonly handler: DeleteUserHandler) {}

  @Delete(':uuid')
  async handle(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.handler.handle(uuid);
  }
}

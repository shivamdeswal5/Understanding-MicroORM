import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteUserHandler } from './delete-user.handler';

@Controller('users')
export class DeleteUserController {
  constructor(private readonly handler: DeleteUserHandler) {}

  @Delete(':uuid/delete-user')
  async handle(@Param('uuid') uuid: string) {
    return this.handler.handle(uuid);
  }
}

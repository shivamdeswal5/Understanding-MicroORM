import { Controller, Get, Param, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { GetUserHandler } from './get-user.handler';

@Controller('users')
export class GetUserController {
  constructor(private readonly handler: GetUserHandler) {}

  @Get(':uuid')
  async handle(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return await this.handler.handle(uuid);
  }
}

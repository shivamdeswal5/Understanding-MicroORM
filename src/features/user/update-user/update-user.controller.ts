import { Controller, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { UpdateUserHandler } from './update-user.handler';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UpdateUserController {
  constructor(private readonly handler: UpdateUserHandler) {}

  @Put(':uuid')
  async handle(@Param('uuid') uuid: string, @Body() dto: UpdateUserDto) {
    return await this.handler.handle(uuid, dto);

  }
}

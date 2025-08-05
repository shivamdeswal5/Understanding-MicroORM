import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserHandler } from './create-user.handler';
import { CreateUserDto } from './create-user.dto';
import { CreateUserCommand } from './create-user.command';

@Controller('users')
export class CreateUserController {
  constructor(private readonly handler: CreateUserHandler) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const command = new CreateUserCommand(
      dto.first_name,
      dto.last_name,
      dto.email,
      dto.password,
      dto.role,
    );
    return await this.handler.handle(command);
  }
}

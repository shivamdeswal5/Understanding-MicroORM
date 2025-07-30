import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ListUsersHandler } from './list-users.handler';
import { ListUsersDto } from './list-users.dto';
import { ListUsersQuery } from './list-users.query';

@Controller('users')
export class ListUserController {
  constructor(private readonly handler: ListUsersHandler) {}

  @Get()
  async listUsers(@Query() body: ListUsersDto) {
    const query = new ListUsersQuery(body);
    return await this.handler.handle(query);
  }
}

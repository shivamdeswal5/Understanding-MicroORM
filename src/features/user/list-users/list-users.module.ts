import { Module } from '@nestjs/common';
import { ListUserController } from './list-users.controller';
import { ListUsersHandler } from './list-users.handler';

@Module({
  controllers: [ListUserController],
  providers: [ListUsersHandler],
})
export class ListUserModule {}

import { Module } from '@nestjs/common';
import { GetUserHandler } from './get-user.handler';
import { GetUserController } from './get-user.controller';

@Module({
  controllers: [GetUserController],
  providers: [GetUserHandler],
})
export class GetUserModule {}

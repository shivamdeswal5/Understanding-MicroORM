import { Module } from '@nestjs/common';
import { ListTodosHandler } from './list-todos.handler';
import { ListTodosController } from './list-todos.controller';

@Module({
  controllers: [ListTodosController],
  providers: [ListTodosHandler],
})
export class GetTodosModule {}

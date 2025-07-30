import { Module } from '@nestjs/common';
import { MarkTodoIncompleteController } from './mark-todo-incomplete.controller';
import { MarkTodoIncompleteHandler } from './mark-todo-incomplete.handler';

@Module({
  controllers: [MarkTodoIncompleteController],
  providers: [MarkTodoIncompleteHandler],
})
export class MarkTodoIncompleteModule {}

import { Module } from '@nestjs/common';
import { MarkTodoCompleteController } from './mark-todo-complete.controller';
import { MarkTodoCompleteHandler } from './mark-todo-complete.handler';

@Module({
  controllers: [MarkTodoCompleteController],
  providers: [MarkTodoCompleteHandler],
})
export class MarkTodoCompleteModule {}

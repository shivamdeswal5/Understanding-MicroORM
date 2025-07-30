import { Module } from '@nestjs/common';
import { DeleteTodoHandler } from './delete.todo.handler';
import { DeleteTodoController } from './delete-todo.controller';
import { TodoRepository } from 'src/infrastructure/repository/todo/todo.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from 'src/domain/todo/todo.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Todo])],
  controllers: [DeleteTodoController],
  providers: [DeleteTodoHandler, TodoRepository],
})
export class DeleteTodoModule {}

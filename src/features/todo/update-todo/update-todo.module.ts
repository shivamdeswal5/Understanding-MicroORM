import { Module } from '@nestjs/common';
import { UpdateTodoHandler } from './update-todo.handler';
import { UpdateTodoController } from './update-todo.controller';
import { TodoRepository } from 'src/infrastructure/repository/todo/todo.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from 'src/domain/todo/todo.entity';
import { User } from 'src/domain/user/user.entity';
import { UserRepository } from 'src/infrastructure/repository/user/user.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Todo,User])],
  controllers: [UpdateTodoController],
  providers: [UpdateTodoHandler, TodoRepository,UserRepository],
})
export class UpdateTodosModule {}

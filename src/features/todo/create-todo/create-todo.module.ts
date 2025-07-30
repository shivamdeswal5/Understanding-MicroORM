import { Module } from '@nestjs/common';
import { CreateTodoController } from './create-todo.controller';
import { CreateTodoHandler } from './create-todo.handler';
import { TodoRepository } from 'src/infrastructure/repository/todo/todo.repository';
import { UserRepository } from 'src/infrastructure/repository/user/user.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from 'src/domain/todo/todo.entity';
import { User } from 'src/domain/user/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Todo,User])],
  controllers: [CreateTodoController],
  providers: [CreateTodoHandler, TodoRepository, UserRepository],
})
export class CreateTodoModule {}

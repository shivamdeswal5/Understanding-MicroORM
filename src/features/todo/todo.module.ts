import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from 'src/domain/todo/todo.entity';
import { CreateTodoModule } from './create-todo/create-todo.module';
import { GetTodosModule } from './list-todos/list-todos.module';
import { UpdateTodosModule } from './update-todo/update-todo.module';
import { DeleteTodoModule } from './delete-todo/delete-todo.module';
import { MarkTodoCompleteModule } from './mark-todo-complete/mark-todo-complete.module';
import { MarkTodoIncompleteModule } from './mark-todo-incomplete/mark-todo-incomplete.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Todo]),
    CreateTodoModule,
    GetTodosModule,
    UpdateTodosModule,
    DeleteTodoModule,
    MarkTodoCompleteModule,
    MarkTodoIncompleteModule
  ],
})
export class TodoModule {} 

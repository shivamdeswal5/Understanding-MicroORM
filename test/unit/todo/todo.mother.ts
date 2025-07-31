import { Todo } from '../../../src/domain/todo/todo.entity';
import { UserMother } from '../user/user.mother';

export class TodoMother {
  static validTodoData(overrides = {}) {
    const user = UserMother.validUser();

    return {
      title: 'Write unit tests',
      description: 'Write and verify test cases for TodoRepository',
      completed: false,
      user,
      ...overrides,
    };
  }

  static validTodo(overrides = {}) {
    const todo = new Todo();
    const data = this.validTodoData(overrides);

    todo.title = data.title;
    todo.description = data.description;
    todo.completed = data.completed;
    todo.user = data.user;

    return todo;
  }
}

import { Todo } from '../../../src/domain/todo/todo.entity';
import { UserMother } from '../user/user.mother';

export class TodoMother {
  static validCreateCommandData(overrides = {}) {
    const user = UserMother.validUser();
    return {
      title: 'Write unit tests',
      description: 'Write and verify test cases for TodoRepository',
      completed: false,
      user_uuid: user.uuid,
      ...overrides,
    };
  }

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
    const data = this.validTodoData(overrides);
    const todo = new Todo();
    todo.title = data.title;
    todo.description = data.description;
    todo.completed = data.completed;
    todo.user = data.user;
    return todo;
  }
}

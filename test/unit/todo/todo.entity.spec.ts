import { Todo } from '../../../src/domain/todo/todo.entity';
import { User } from '../../../src/domain/user/user.entity';
import { validate as isUUID, v4 as uuidv4 } from 'uuid';


describe('Test case for Todo Entity', () => {
  describe('on creation', () => {
    it('should assign a valid UUID manually (simulate MikroORM)', () => {

      const todo = new Todo();
      todo.uuid = uuidv4(); 
      expect(todo.uuid).toBeDefined();
      expect(isUUID(todo.uuid)).toBe(true);
    });

    it('should initialize default completed to false', () => {
      const todo = new Todo();
      expect(todo.completed).toBe(false);
    });

    it('should set created_at and updated_at', () => {
      const todo = new Todo();
      expect(todo.created_at).toBeInstanceOf(Date);
      expect(todo.updated_at).toBeInstanceOf(Date);
    });

    it('should assign user, title, and optional description', () => {

      const user = new User();
      user.uuid = uuidv4();

      const todo = new Todo();
      todo.title = 'Test Todo';
      todo.description = 'Optional Description';
      todo.user = user;

      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('Optional Description');
      expect(todo.user).toBe(user);
    });
  });

  describe('Domain methods', () => {
    it('should mark a todo as completed', () => {
      const todo = new Todo();
      todo.completed = false;
      todo.markAsCompleted();
      expect(todo.completed).toBe(true);
    });

    it('should not mark a todo as completed again if already completed', () => {
      const todo = new Todo();
      todo.completed = true;
      todo.markAsCompleted();
      expect(todo.completed).toBe(true); 
    });

    it('should unmark a completed todo', () => {
      const todo = new Todo();
      todo.completed = true;
      todo.unmarkCompleted();
      expect(todo.completed).toBe(false);
    });

    it('should not unmark a todo if already incomplete', () => {
      const todo = new Todo();
      todo.completed = false;
      todo.unmarkCompleted();
      expect(todo.completed).toBe(false); 
    });
  });
});

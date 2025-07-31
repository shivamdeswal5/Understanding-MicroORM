import { TodoRepository } from '../../../src/infrastructure/repository/todo/todo.repository';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Todo } from '../../../src/domain/todo/todo.entity';
import { TodoMother } from './todo.mother';

describe('Test case for TodoRepository', () => {
  let repository: TodoRepository;
  let entityRepo: EntityRepository<Todo>;
  let em: EntityManager;

  const mockPersist = jest.fn();
  const mockFlush = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    mockPersist.mockReset();
    mockFlush.mockReset();
    mockRemove.mockReset();

    em = {
      persist: mockPersist,
      flush: mockFlush,
      remove: mockRemove,
    } as unknown as EntityManager;

    entityRepo = {
      findOne: jest.fn(),
    } as unknown as EntityRepository<Todo>;

    repository = new TodoRepository(entityRepo, em);
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const dto = TodoMother.validTodoData();

      const result = await repository.createTodo(dto);

      expect(result.title).toBe(dto.title);
      expect(result.description).toBe(dto.description);
      expect(result.completed).toBe(dto.completed);
      expect(result.user).toBe(dto.user);
      expect(mockPersist).toHaveBeenCalledWith(result);
      expect(mockFlush).toHaveBeenCalled();
    });
  });

  describe('findOneByUuid', () => {
    it('should return todo by uuid', async () => {
      const todo = TodoMother.validTodo();
      (entityRepo.findOne as jest.Mock).mockResolvedValue(todo);

      const result = await repository.findOneByUuid(todo.uuid);

      expect(result).toBe(todo);
      expect(entityRepo.findOne).toHaveBeenCalledWith({ uuid: todo.uuid });
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', async () => {
      const todo = TodoMother.validTodo();
      (entityRepo.findOne as jest.Mock).mockResolvedValue(todo);

      const updated = await repository.updateTodo(todo.uuid, {
        title: 'Updated Title',
        completed: true,
      });

      expect(updated).toBe(todo);
      expect(todo.title).toBe('Updated Title');
      expect(todo.completed).toBe(true);
      expect(mockFlush).toHaveBeenCalled();
    });

    it('should return null if todo not found', async () => {
      (entityRepo.findOne as jest.Mock).mockResolvedValue(null);

      const updated = await repository.updateTodo('non-existent-uuid', {
        title: 'Should Not Matter',
      });

      expect(updated).toBeNull();
      expect(mockFlush).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const todo = TodoMother.validTodo();

      await repository.remove(todo);

      expect(mockRemove).toHaveBeenCalledWith(todo);
      expect(mockFlush).toHaveBeenCalled();
    });
  });
});

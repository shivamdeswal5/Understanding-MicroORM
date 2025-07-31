import { User } from '../../../src/domain/user/user.entity';
import { validate as isUUID, v4 as uuidv4 } from 'uuid';

describe(' Test case for User Entity', () => {
  describe('on creation', () => {
    it('should assign a valid UUID manually (simulating MikroORM)', () => {
      const user = new User();
      user.uuid = uuidv4();

      expect(user.uuid).toBeDefined();
      expect(isUUID(user.uuid)).toBe(true);
    });

    it('should initialize created_at and updated_at', () => {

      const user = new User();

      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it('should initialize todos as an empty collection', () => {
      const user = new User();

      expect(user.todos).toBeDefined();
      expect(user.todos.isInitialized()).toBe(true);
      expect(user.todos.length).toBe(0);
    });

    it('should allow setting first_name, last_name, and email', () => {

      const user = new User();

      user.first_name = 'Shivam';
      user.last_name = 'Deswal';
      user.email = 'shivam@gmail.com';

      expect(user.first_name).toBe('Shivam');
      expect(user.last_name).toBe('Deswal');
      expect(user.email).toBe('shivam@gmail.com');
    });
  });
});

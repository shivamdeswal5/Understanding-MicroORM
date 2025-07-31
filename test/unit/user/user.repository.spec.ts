import { UserRepository } from '../../../src/infrastructure/repository/user/user.repository';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { User } from '../../../src/domain/user/user.entity';
import { UserMother } from './user.mother';

describe('Test case for UserRepository', () => {
  let userRepository: UserRepository;
  let mockEm: jest.Mocked<EntityManager>;
  let mockRepo: jest.Mocked<EntityRepository<User>>;

  beforeEach(() => {
    mockEm = {
      persist: jest.fn(),
      flush: jest.fn(),
      remove: jest.fn(),
    } as any;

    mockRepo = {
      findOne: jest.fn(),
    } as any;

    userRepository = new UserRepository(mockRepo, mockEm);
  });

  describe('createUser', () => {
    it('should create and persist a user', async () => {
      const userData = UserMother.validUserData();
      const result = await userRepository.createUser(userData);

      expect(mockEm.persist).toHaveBeenCalledWith(expect.any(User));
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result.first_name).toBe(userData.first_name);
    });
  });

  describe('findOneByUuid', () => {
    it('should return a user if found', async () => {
      const user = UserMother.validUser();
      mockRepo.findOne.mockResolvedValue(user);

      const result = await userRepository.findOneByUuid(user.uuid);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ uuid: user.uuid });
      expect(result).toBe(user);
    });

    it('should return null if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await userRepository.findOneByUuid('some-uuid');

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      const user = UserMother.validUser();

      await userRepository.remove(user);

      expect(mockEm.remove).toHaveBeenCalledWith(user);
      expect(mockEm.flush).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user fields if user is found', async () => {
      const user = UserMother.validUser();
      mockRepo.findOne.mockResolvedValue(user);

      const dto = { first_name: 'Updated', email: 'updated@mail.com' };

      const result = await userRepository.updateUser(user.uuid, dto);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ uuid: user.uuid });
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result?.first_name).toBe(dto.first_name);
      expect(result?.email).toBe(dto.email);
    });

    it('should return null if user is not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await userRepository.updateUser('nonexistent-uuid', { first_name: 'Test' });

      expect(result).toBeNull();
      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });
});

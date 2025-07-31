import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserHandler } from '../../../../src/features/user/delete-user/delete-user.handler';
import { UserRepository } from '../../../../src/infrastructure/repository/user/user.repository';
import { NotFoundException } from '@nestjs/common';
import { UserMother } from '../user.mother';

describe('Test case for DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const mockRepo = {
      findOneByUuid: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        {
          provide: UserRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    handler = module.get(DeleteUserHandler);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the user if found', async () => {
    const user = UserMother.validUser();

    (userRepository.findOneByUuid as jest.Mock).mockResolvedValue(user);
    (userRepository.remove as jest.Mock).mockResolvedValue(undefined);

    const result = await handler.handle(user.uuid);

    expect(userRepository.findOneByUuid).toHaveBeenCalledWith(user.uuid);
    expect(userRepository.remove).toHaveBeenCalledWith(user);
    expect(result).toEqual({ message: 'User deleted successfully' });
  });

  it('should throw NotFoundException if user not found', async () => {
    const uuid = 'non-existent-uuid';
    (userRepository.findOneByUuid as jest.Mock).mockResolvedValue(null);

    await expect(handler.handle(uuid)).rejects.toThrow(NotFoundException);
    expect(userRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
    expect(userRepository.remove).not.toHaveBeenCalled();
  });
});

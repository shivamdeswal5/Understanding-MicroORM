import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserHandler } from '../../../../src/features/user/update-user/update-user.handler';
import { UserRepository } from '../../../../src/infrastructure/repository/user/user.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../../../../src/features/user/update-user/update-user.dto';

describe('Test case for UpdateUserHandler', () => {
  let handler: UpdateUserHandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const mockRepo = {
      updateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: UserRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    handler = module.get(UpdateUserHandler);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the user and return updated user', async () => {
    const uuid = 'abc-123';
    const dto: UpdateUserDto = {
      first_name: 'Updated',
      last_name: 'User',
      email: 'updated@mail.com',
    };

    const updatedUser = { uuid, ...dto };

    (userRepository.updateUser as jest.Mock).mockResolvedValue(updatedUser);

    const result = await handler.handle(uuid, dto);

    expect(userRepository.updateUser).toHaveBeenCalledWith(uuid, dto);
    expect(result).toEqual(updatedUser);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const uuid = 'not-found-uuid';
    const dto: UpdateUserDto = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@mail.com',
    };

    (userRepository.updateUser as jest.Mock).mockRejectedValue(new NotFoundException('User not found'));

    await expect(handler.handle(uuid, dto)).rejects.toThrow(NotFoundException);
    expect(userRepository.updateUser).toHaveBeenCalledWith(uuid, dto);
  });
});

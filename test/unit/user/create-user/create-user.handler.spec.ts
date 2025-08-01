import { Test } from '@nestjs/testing';
import { CreateUserHandler } from '../../../../src/features/user/create-user/create-user.handler';
import { UserRepository } from '../../../../src/infrastructure/repository/user/user.repository';
import { CreateUserCommand } from '../../../../src/features/user/create-user/create-user.command';
import { UserMother } from '../user.mother';
import { Collection } from '@mikro-orm/core';
import { Todo } from '../../../../src/domain/todo/todo.entity';

describe('Test case for CreateUserHandler (with NestJS TestingModule)', () => {
  let handler: CreateUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(CreateUserHandler);
    userRepository = moduleRef.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user and return success message', async () => {
    const userData = UserMother.validUserData();
    const command = new CreateUserCommand(
      userData.first_name,
      userData.last_name,
      userData.email,
    );

    const mockUser = {
      ...userData,
      id: 1,
      uuid: 'mock-uuid',
      todos: new Collection<Todo>([]),
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepository.createUser.mockResolvedValue(mockUser);

    const result = await handler.handle(command);

    expect(userRepository.createUser).toHaveBeenCalledWith(userData);
    expect(result).toEqual({ message: 'User created successfully' });
  });

  it('should throw an error if repository fails', async () => {
    const userData = UserMother.validUserData();
    const command = new CreateUserCommand(
      userData.first_name,
      userData.last_name,
      userData.email,
    );

    userRepository.createUser.mockRejectedValue(new Error('DB error'));

    await expect(handler.handle(command)).rejects.toThrow('DB error');
    expect(userRepository.createUser).toHaveBeenCalledWith(userData);
  });
});

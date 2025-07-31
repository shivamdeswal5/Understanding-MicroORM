import { Test, TestingModule } from '@nestjs/testing';
import { GetUserHandler } from '../../../../src/features/user/get-user/get-user.handler';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../../../src/domain/user/user.entity';
import { UserMother } from '../../../unit/user/user.mother';

describe('Test case for GetUserHandler', () => {
  let handler: GetUserHandler;
  let em: EntityManager;

  beforeEach(async () => {
    const mockEntityManager = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserHandler,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    handler = module.get(GetUserHandler);
    em = module.get(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user for a valid uuid', async () => {
    const expectedUser = UserMother.validUser();
    const uuid = expectedUser.uuid;

    (em.findOne as jest.Mock).mockResolvedValue(expectedUser);

    const result = await handler.handle(uuid);

    expect(em.findOne).toHaveBeenCalledWith(User, { uuid });
    expect(result).toEqual(expectedUser);
  });

  it('should return null if user is not found', async () => {
    const uuid = 'non-existing-uuid';

    (em.findOne as jest.Mock).mockResolvedValue(null);

    const result = await handler.handle(uuid);

    expect(em.findOne).toHaveBeenCalledWith(User, { uuid });
    expect(result).toBeNull();
  });
});

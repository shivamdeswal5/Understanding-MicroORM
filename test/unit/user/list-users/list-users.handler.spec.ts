import { Test, TestingModule } from '@nestjs/testing';
import { ListUsersHandler } from '../../../../src/features/user/list-users/list-users.handler';
import { EntityManager, QueryBuilder } from '@mikro-orm/postgresql';
import { ListUsersDto } from '../../../../src/features/user/list-users/list-users.dto';
import { User } from '../../../../src/domain/user/user.entity';

describe('Test case for ListUsersHandler', () => {
  let handler: ListUsersHandler;
  let em: EntityManager;
  let qb: Partial<jest.Mocked<QueryBuilder<User>>>;

  beforeEach(async () => {
    qb = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getResultAndCount: jest.fn(),
    };

    const emMock = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListUsersHandler,
        {
          provide: EntityManager,
          useValue: emMock,
        },
      ],
    }).compile();

    handler = module.get(ListUsersHandler);
    em = module.get(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated users with search filter', async () => {
    const dto: ListUsersDto = { page: 1, limit: 10, search: 'shivam' };

    const users = [{ uuid: 'uuid-1', first_name: 'Shivam', email: 'test@example.com' }];
    const total = 1;

    (qb.getResultAndCount as jest.Mock).mockResolvedValue([users, total]);

    const result = await handler.handle(dto);

    expect(em.createQueryBuilder).toHaveBeenCalledWith(User, 'u');
    expect(qb.where).toHaveBeenCalledWith({
      $or: [
        { first_name: { $ilike: '%shivam%' } },
        { last_name: { $ilike: '%shivam%' } },
        { email: { $ilike: '%shivam%' } },
      ],
    });
    expect(qb.orderBy).toHaveBeenCalledWith({ 'u.created_at': 'DESC' });
    expect(qb.limit).toHaveBeenCalledWith(10);
    expect(qb.offset).toHaveBeenCalledWith(0);

    expect(result).toEqual({
      data: users,
      total,
      page: 1,
      limit: 10,
    });
  });

  it('should return paginated users without search filter', async () => {
    const dto: ListUsersDto = { page: 2, limit: 5 }; // no search

    const users = [];
    const total = 0;

    (qb.getResultAndCount as jest.Mock).mockResolvedValue([users, total]);

    const result = await handler.handle(dto);

    expect(qb.where).not.toHaveBeenCalled();
    expect(qb.limit).toHaveBeenCalledWith(5);
    expect(qb.offset).toHaveBeenCalledWith(5);

    expect(result).toEqual({
      data: [],
      total: 0,
      page: 2,
      limit: 5,
    });
  });
});

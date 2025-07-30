import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ListUsersDto } from './list-users.dto';
import { User } from 'src/domain/user/user.entity';

@Injectable()
export class ListUsersHandler {
  constructor(private readonly em: EntityManager) {}

  async handle(query: ListUsersDto) {
    const { page, limit, search } = query;
    const offset = (page - 1) * limit;

    const qb = this.em.createQueryBuilder(User, 'u');

    if (search) {
      qb.where({
        $or: [
          { first_name: { $ilike: `%${search}%` } },
          { last_name: { $ilike: `%${search}%` } },
          { email: { $ilike: `%${search}%` } },
        ],
      });
    }

    qb.orderBy({ 'u.created_at': 'DESC' }).limit(limit).offset(offset);

    const [users, total] = await qb.getResultAndCount();

    return {
      data: users,
      total,
      page,
      limit,
    };
  }
}

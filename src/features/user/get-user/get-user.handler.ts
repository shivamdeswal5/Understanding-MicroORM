import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../../../src/domain/user/user.entity';

@Injectable()
export class GetUserHandler {
  constructor(private readonly em: EntityManager) {}

  async handle(uuid: string) {
    return await this.em.findOne(User, { uuid });
  }
}

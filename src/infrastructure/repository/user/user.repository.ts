import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../domain/user/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async createUser(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: 'owner' | 'passenger';
  }) {
    const user = new User();
    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.email = data.email;
    user.password = data.password;
    user.role = data.role;
  
    this.em.persist(user);
    await this.em.flush();
    return user;
  }
  

  async findOneByUuid(uuid: string): Promise<User | null> {
    return this.repository.findOne({ uuid });
  }

  async remove(user: User): Promise<void> {
    this.em.remove(user);
    await this.em.flush();
  }


  async updateUser(uuid: string, dto: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    role: 'owner'|'passenger';
    password: string;
  }>) {
    const user = await this.repository.findOne({ uuid });
  
    if (!user) {
      throw new NotFoundException(`User with uuid ${uuid} not found`);
    }
  
    if (dto.first_name !== undefined) user.first_name = dto.first_name;
    if (dto.last_name !== undefined) user.last_name = dto.last_name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.password !== undefined) user.password = dto.password;
  
    await this.em.flush();
  
    return user;
  }
  

}

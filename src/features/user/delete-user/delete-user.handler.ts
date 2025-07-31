import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/repository/user/user.repository';

@Injectable()
export class DeleteUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(uuid: string) {
    const user = await this.userRepository.findOneByUuid(uuid);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }
}

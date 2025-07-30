import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';
import { UserRepository } from 'src/infrastructure/repository/user/user.repository';

@Injectable()
export class UpdateUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(uuid: string, dto: UpdateUserDto) {
    return this.userRepository.updateUser(uuid, dto);
  }
}

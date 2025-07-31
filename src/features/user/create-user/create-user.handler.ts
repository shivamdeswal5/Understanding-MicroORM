import { Injectable } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../infrastructure/repository/user/user.repository';

@Injectable()
export class CreateUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: CreateUserCommand) {
    const { first_name, last_name, email } = command;
    await this.userRepository.createUser({ first_name, last_name, email });
    return {
      message: 'User created successfully'
    };
  }
}

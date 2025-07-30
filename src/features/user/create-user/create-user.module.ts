import { Module } from '@nestjs/common';
import { CreateUserController } from './create-user.controller';
import { CreateUserHandler } from './create-user.handler';
import { UserRepository } from 'src/infrastructure/repository/user/user.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/domain/user/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [CreateUserController],
  providers: [CreateUserHandler, UserRepository],
})
export class CreateUserModule {}

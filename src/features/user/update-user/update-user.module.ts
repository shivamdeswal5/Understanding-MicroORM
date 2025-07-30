import { Module } from '@nestjs/common';
import { UpdateUserController } from './update-user.controller';
import { UpdateUserHandler } from './update-user.handler';
import { UserRepository } from 'src/infrastructure/repository/user/user.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/domain/user/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UpdateUserController],
  providers: [UpdateUserHandler, UserRepository],
})
export class UpdateUserModule {}

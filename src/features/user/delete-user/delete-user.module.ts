import { Module } from '@nestjs/common';
import { DeleteUserHandler } from './delete-user.handler';
import { DeleteUserController } from './delete-user.controller';
import { UserRepository } from 'src/infrastructure/repository/user/user.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/domain/user/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [DeleteUserController],
  providers: [DeleteUserHandler, UserRepository],
})
export class DeleteUserModule {}

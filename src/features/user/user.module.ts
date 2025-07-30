import { Module } from '@nestjs/common';
import { ListUserModule } from './list-users/list-users.module';
import { MikroOrmDatabaseModule } from 'src/infrastructure/database/mikro-orm';
import { CreateUserModule } from './create-user/create-user.module';
import { DeleteUserModule } from './delete-user/delete-user.module';
import { UpdateUserModule } from './update-user/update-user.module';
import { GetUserModule } from './get-user/get-user.module';

@Module({
  imports:[ 
  ListUserModule,
  CreateUserModule,
  DeleteUserModule,
  UpdateUserModule,
  GetUserModule,
  MikroOrmDatabaseModule
],
})
export class UserModule {} 

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './features/user/user.module';
import { TodoModule } from './features/todo/todo.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 
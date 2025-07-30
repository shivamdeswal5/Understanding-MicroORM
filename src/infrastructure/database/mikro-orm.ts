import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { createMikroOrmOptions } from './config/mikro-orm.config';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: () => ({
        ...createMikroOrmOptions(),
        autoLoadEntities: false,
      }),
    }),
    MikroOrmModule,
  ],
  exports: [MikroOrmModule],
})
export class MikroOrmDatabaseModule {}

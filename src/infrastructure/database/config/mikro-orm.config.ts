import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PostgreSqlOptions } from '@mikro-orm/postgresql/PostgreSqlMikroORM';
import * as dotenv from 'dotenv';

dotenv.config();

export const createMikroOrmOptions = (): PostgreSqlOptions => ({
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_DATABASE,
  entities: ['dist/domain/**/*.entity.js'],
  migrations: {
    path: 'dist/infrastructure/database/migrations',
    tableName: 'migrations',
    snapshot: false
  },
  forceUtcTimezone: true,
  timezone: 'UTC',
  extensions: [Migrator],
});

export default defineConfig({
  ...createMikroOrmOptions(),
});

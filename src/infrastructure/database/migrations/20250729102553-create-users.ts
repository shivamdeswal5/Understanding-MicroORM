import { Migration } from '@mikro-orm/migrations';
import * as dotenv from 'dotenv';

dotenv.config();
const schema = process.env.DB_APPLICATIONS_FOR_STAY_SCHEMA || 'public';

export class CreateUsersMigration20250729102553 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    this.addSql(`
      CREATE TABLE "${schema}"."users" (
        "id"            SERIAL       PRIMARY KEY,
        "uuid"          UUID         DEFAULT uuid_generate_v4() NOT NULL,
        "first_name"    VARCHAR,
        "last_name"     VARCHAR,
        "email"         VARCHAR      UNIQUE,
        "created_at"    TIMESTAMP    NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP    NOT NULL DEFAULT now(),
        CONSTRAINT "users_uuid_unique" UNIQUE ("uuid")
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP EXTENSION IF EXISTS "uuid-ossp";`);
    this.addSql(`DROP TABLE IF EXISTS "${schema}"."users" CASCADE;`);
  }
}

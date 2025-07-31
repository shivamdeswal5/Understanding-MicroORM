import { Migration } from '@mikro-orm/migrations';

export class CreateTodosMigrations20250729104530 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "todos" (
        "id"           SERIAL PRIMARY KEY,
        "uuid"         UUID DEFAULT uuid_generate_v4() NOT NULL,
        "title"        VARCHAR NOT NULL,
        "description"  VARCHAR,
        "completed"    BOOLEAN NOT NULL DEFAULT false,
        "user_id"      INT NOT NULL,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "todos_uuid_unique" UNIQUE ("uuid"),
        CONSTRAINT "todo_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "todos" CASCADE;`);
  }
}

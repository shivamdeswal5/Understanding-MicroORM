import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Todo } from '../todo/todo.entity';

@Entity({ tableName: 'users' }) 
export class User {
  @PrimaryKey()
  id: number;

  @Property({ type: 'uuid', unique: true, defaultRaw: 'uuid_generate_v4()' })
  uuid: string;

  @Property()
  first_name: string;

  @Property()
  last_name: string;

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Property()
  role: 'owner' | 'passenger';

  @OneToMany(() => Todo, todo => todo.user)
  todos = new Collection<Todo>(this);

  @Property({ onCreate: () => new Date() })
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();
}

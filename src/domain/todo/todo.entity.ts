import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'todos' }) 
export class Todo {
    @PrimaryKey()
    id: number;

    @Property({ type: 'uuid', unique: true, onCreate: () => uuidv4()})
    uuid: string;

    @Property()
    title!: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ default: false })
    completed: boolean = false;

    @ManyToOne(() => User, {
        fieldName: 'user_id', 
        nullable: false,   
      })
      user!: User;

    @Property({ onCreate: () => new Date() })
    created_at: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updated_at: Date = new Date();

    markAsCompleted() {
      if (!this.completed) {
        this.completed = true;
      }
    }
    unmarkCompleted() {
      if (this.completed) {
        this.completed = false;
      }
    }

}

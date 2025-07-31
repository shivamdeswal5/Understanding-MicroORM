import { User } from '../../../src/domain/user/user.entity';
import { v4 as uuidv4 } from 'uuid';

export class UserMother {
  static validUserData() {
    return {
      first_name: 'Shivam',
      last_name: 'Deswal',
      email: 'shivam@mail.com',
    };
  }

  static validUser(): User {
    const user = new User();
    user.uuid = uuidv4();
    user.first_name = 'Shivam';
    user.last_name = 'Deswal';
    user.email = 'shivam@mail.com';
    return user;
  }
}

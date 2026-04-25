import { User } from '../User';
import { Email } from '../value-objects/Email';
import { DomainError } from '../errors';

export class UserFactory {
  static createNew(emailString: string, role: string): User {
    const email = new Email(emailString);
    if (role !== 'TEACHER' && role !== 'STUDENT') throw new DomainError('Invalid role');
    return new User({ email, role });
  }
}
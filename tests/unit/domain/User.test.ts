import { User } from '../../../src/domain/User';
import { Email } from '../../../src/domain/value-objects/Email';

describe('User Domain', () => {
  it('should create a valid user', () => {
    const email = new Email('test@test.com');
    const user = new User({ id: 1, email, role: 'STUDENT' });
    
    expect(user.email.value).toBe('test@test.com');
    expect(user.role).toBe('STUDENT');
  });
});
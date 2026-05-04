import { LoginUserHandler } from '../../../../../src/application/handlers/auth/LoginUserHandler';
import { LoginUserQuery } from '../../../../../src/application/queries/auth/LoginUserQuery';
import { UserRepository } from '../../../../../src/infrastructure/UserRepository';
import { User } from '../../../../../src/domain/User';
import { Email } from '../../../../../src/domain/value-objects/Email';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('LoginUserHandler', () => {
  let mockUserRepo: Record<string, jest.Mock>;
  let mockUser: User;

  beforeEach(() => {
    mockUser = new User({
      id: 1,
      email: new Email('test@test.com'),
      role: 'STUDENT'
    });

    (mockUser as any).checkPassword = jest.fn().mockResolvedValue(true);

    mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(mockUser)
    };

    (jwt.sign as jest.Mock).mockReturnValue('fake_jwt_token');
  });

  it('should return token if credentials are valid', async () => {
    const query = new LoginUserQuery('test@test.com', 'password123');
    const handler = new LoginUserHandler(mockUserRepo as unknown as UserRepository);

    const result = await handler.execute(query);

    expect(result).toBe('fake_jwt_token');
  });

  it('should throw error if user not found', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    const query = new LoginUserQuery('wrong@test.com', 'password123');
    const handler = new LoginUserHandler(mockUserRepo as unknown as UserRepository);

    await expect(handler.execute(query)).rejects.toThrow('Користувача не знайдено');
  });

  it('should throw error if password is wrong', async () => {
    (mockUser as any).checkPassword.mockResolvedValue(false);
    const query = new LoginUserQuery('test@test.com', 'wrongpassword');
    const handler = new LoginUserHandler(mockUserRepo as unknown as UserRepository);

    await expect(handler.execute(query)).rejects.toThrow('Невірний пароль');
  });
});
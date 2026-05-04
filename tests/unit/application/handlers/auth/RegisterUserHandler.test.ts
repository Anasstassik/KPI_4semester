import { RegisterUserHandler } from '../../../../../src/application/handlers/auth/RegisterUserHandler';
import { RegisterUserCommand } from '../../../../../src/application/commands/auth/RegisterUserCommand';
import { UserRepository } from '../../../../../src/infrastructure/UserRepository';
import { User } from '../../../../../src/domain/User';

describe('RegisterUserHandler', () => {
  let mockUserRepo: Record<string, jest.Mock>;
  let handler: RegisterUserHandler;

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      save: jest.fn()
    };
    handler = new RegisterUserHandler(mockUserRepo as unknown as UserRepository);
  });

  it('should register user if email is unique', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.save.mockResolvedValue(1);

    const command = new RegisterUserCommand('test@test.com', 'password123', 'STUDENT');
    const result = await handler.execute(command);

    expect(result).toBe(1);
    expect(mockUserRepo.save).toHaveBeenCalled();
  });

  it('should throw error if user already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1 } as User);

    const command = new RegisterUserCommand('test@test.com', 'password123', 'STUDENT');

    await expect(handler.execute(command)).rejects.toThrow('Користувач з таким email вже існує');
  });
});
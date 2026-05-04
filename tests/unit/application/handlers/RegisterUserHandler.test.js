const RegisterUserHandler = require('../../../../src/application/handlers/auth/RegisterUserHandler');
const { DomainError } = require('../../../../src/domain/errors');
const bcrypt = require('bcryptjs');

jest.mock('bcryptjs');

describe('RegisterUserHandler (Unit)', () => {
  let mockRepo;
  let handler;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      save: jest.fn()
    };
    handler = new RegisterUserHandler(mockRepo);
  });

  it('має реєструвати користувача та повертати лише ID', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed');
    mockRepo.save.mockResolvedValue({ id: 1 });

    const result = await handler.execute({
      email: 'test@kpi.ua',
      password: '123',
      role: 'STUDENT'
    });

    expect(mockRepo.save).toHaveBeenCalled();
    expect(result).toEqual({ userId: 1 });
  });

  it('має кидати помилку при дублікаті email', async () => {
    mockRepo.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      handler.execute({ email: 'test@kpi.ua', password: '123', role: 'STUDENT' })
    ).rejects.toThrow(DomainError);
  });
});
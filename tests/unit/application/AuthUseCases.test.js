const AuthUseCases = require('../../../src/application/AuthUseCases');
const User = require('../../../src/domain/User');
const { DomainError } = require('../../../src/domain/errors');
const bcrypt = require('bcryptjs');

jest.mock('bcryptjs');

describe('AuthUseCases', () => {
  let mockUserRepository;
  let authUseCases;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn()
    };
    authUseCases = new AuthUseCases(mockUserRepository, 'secret');
  });

  it('повинен реєструвати нового користувача', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password');
    mockUserRepository.save.mockImplementation(async (u) => {
      u.id = 1;
      return u;
    });

    const user = await authUseCases.register({ email: 'test@kpi.ua', password: '123', role: 'STUDENT' });
    
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(user.id).toBe(1);
    expect(user.password).toBe('hashed_password');
  });

  it('повинен кидати помилку якщо email вже існує', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(new User({ id: 1, email: 'test@kpi.ua' }));

    await expect(
      authUseCases.register({ email: 'test@kpi.ua', password: '123', role: 'STUDENT' })
    ).rejects.toThrow(DomainError);
  });
});
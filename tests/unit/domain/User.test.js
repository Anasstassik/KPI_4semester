const User = require('../../../src/domain/User');
const { DomainError } = require('../../../src/domain/errors');

describe('User Domain', () => {
  it('повинен створювати користувача з валідними даними', () => {
    const user = User.create({ email: 'test@kpi.ua', password: '123', role: 'STUDENT' });
    expect(user.email).toBe('test@kpi.ua');
    expect(user.role).toBe('STUDENT');
  });

  it('повинен кидати помилку при невалідному email', () => {
    expect(() => {
      User.create({ email: 'invalid-email', password: '123', role: 'STUDENT' });
    }).toThrow(DomainError);
    expect(() => {
      User.create({ email: 'invalid-email', password: '123', role: 'STUDENT' });
    }).toThrow('Некоректний формат email');
  });

  it('повинен кидати помилку при відсутності полів', () => {
    expect(() => {
      User.create({ email: 'test@kpi.ua', role: 'STUDENT' });
    }).toThrow(DomainError);
  });
});
const { DomainError } = require('./errors');

class User {
  constructor({ id, email, password, role }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static create({ email, password, role }) {
    if (!email || !password || !role) {
      throw new DomainError('Всі поля обов\'язкові');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new DomainError('Некоректний формат email');
    }
    return new User({ email, password, role });
  }
}

module.exports = User;
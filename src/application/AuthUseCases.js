const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../domain/User');
const { DomainError } = require('../domain/errors');

class AuthUseCases {
  constructor(userRepository, jwtSecret) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  async register({ email, password, role }) {
    const user = User.create({ email, password, role });
    
    const existing = await this.userRepository.findByEmail(user.email);
    if (existing) {
      throw new DomainError('Email вже використовується');
    }

    user.password = await bcrypt.hash(user.password, 10);
    return await this.userRepository.save(user);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new DomainError('Неправильний email або пароль');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new DomainError('Неправильний email або пароль');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return { token, role: user.role };
  }
}

module.exports = AuthUseCases;
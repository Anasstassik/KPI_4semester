const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../../infrastructure/database'); 
const { DomainError } = require('../../../domain/errors');

class LoginUserHandler {
  constructor(jwtSecret) {
    this.jwtSecret = jwtSecret;
  }

  async execute(query) {
    const userRecord = await prisma.user.findUnique({
      where: { email: query.email }
    });

    if (!userRecord) {
      throw new DomainError('Невірний email або пароль');
    }

    const validPassword = await bcrypt.compare(query.password, userRecord.password);
    if (!validPassword) {
      throw new DomainError('Невірний email або пароль');
    }

    const token = jwt.sign(
      { userId: userRecord.id, role: userRecord.role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return { token };
  }
}

module.exports = LoginUserHandler;
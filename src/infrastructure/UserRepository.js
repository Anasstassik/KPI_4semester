const prisma = require('./database');
const User = require('../domain/User');

class UserRepository {
  async findByEmail(email) {
    const data = await prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return new User(data);
  }

  async save(user) {
    const data = await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        role: user.role
      }
    });
    return new User(data);
  }
}

module.exports = UserRepository;
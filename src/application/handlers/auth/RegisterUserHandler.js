const User = require('../../../domain/User');
const { DomainError } = require('../../../domain/errors');
const bcrypt = require('bcryptjs');

class RegisterUserHandler {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(command) {
    const user = User.create({ 
      email: command.email, 
      password: command.password, 
      role: command.role 
    });

    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new DomainError('Користувач з таким email вже існує');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const savedUser = await this.userRepository.save(user);
    return { userId: savedUser.id }; 
  }
}

module.exports = RegisterUserHandler;
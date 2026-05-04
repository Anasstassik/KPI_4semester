import { UserRepository } from '../../../infrastructure/UserRepository';
import { RegisterUserCommand } from '../../commands/auth/RegisterUserCommand';
import { User } from '../../../domain/User';
import { Email } from '../../../domain/value-objects/Email';
import { DomainError } from '../../../domain/errors';

export class RegisterUserHandler {
  constructor(private userRepository: UserRepository) {}

  async execute(command: RegisterUserCommand): Promise<number> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    
    if (existingUser) {
      throw new DomainError('Користувач з таким email вже існує');
    }

    const user = new User({
      email: new Email(command.email),
      role: command.role
    });

    await user.setPassword(command.password);
    
    return await this.userRepository.save(user);
  }
}
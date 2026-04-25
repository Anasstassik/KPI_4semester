import { UserFactory } from '../../../domain/factories/UserFactory';
import { UserRepository } from '../../../infrastructure/UserRepository';

export class RegisterUserHandler {
  constructor(private userRepository: UserRepository) {}

  async execute(command: { email: string; role: string }): Promise<number> {
    const user = UserFactory.createNew(command.email, command.role);
    return await this.userRepository.save(user);
  }
}
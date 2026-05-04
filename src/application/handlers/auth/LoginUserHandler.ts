import jwt from 'jsonwebtoken';
import { DomainError } from '../../../domain/errors';
import { LoginUserQuery } from '../../queries/auth/LoginUserQuery';
import { UserRepository } from '../../../infrastructure/UserRepository';

export class LoginUserHandler {
  constructor(private userRepository: UserRepository) {}

  async execute(query: LoginUserQuery): Promise<string> {
    const user = await this.userRepository.findByEmail(query.email);

    if (!user) {
      throw new DomainError('Користувача не знайдено');
    }

    const isPasswordValid = await user.checkPassword(query.password);
    
    if (!isPasswordValid) {
      throw new DomainError('Невірний пароль');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    return token;
  }
}
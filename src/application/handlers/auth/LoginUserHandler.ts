import jwt from 'jsonwebtoken';
import prisma from '../../../infrastructure/database';
import { DomainError } from '../../../domain/errors';
import { LoginUserQuery } from '../../queries/auth/LoginUserQuery';

export class LoginUserHandler {
  async execute(query: LoginUserQuery): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email: query.email }
    });

    if (!user) {
      throw new DomainError('Користувача не знайдено');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    return token;
  }
}
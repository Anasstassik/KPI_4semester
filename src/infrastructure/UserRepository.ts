import prisma from './database';
import { User } from '../domain/User';

export interface IUserRepository {
  save(user: User): Promise<number>;
}

export class UserRepository implements IUserRepository {
  async save(user: User): Promise<number> {
    const password = (user as any).password;
    const passwordValue = typeof password === 'string' ? password : password?.value;

    const created = await prisma.user.create({
      data: { email: user.email.value, password: passwordValue, role: user.role }
    });
    return created.id;
  }
}
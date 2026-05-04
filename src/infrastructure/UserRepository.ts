import prisma from './database';
import { User } from '../domain/User';
import { Email } from '../domain/value-objects/Email';

export interface IUserRepository {
  save(user: User): Promise<number>;
  findByEmail(email: string): Promise<User | null>;
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

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { email }
    });

    if (!data) {
      return null;
    }

    const user = new User({
      id: data.id,
      email: new Email(data.email),
      role: data.role
    });

    (user as any).password = data.password;

    return user;
  }
}
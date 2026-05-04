import { Email } from './value-objects/Email';
import * as bcrypt from 'bcrypt';

export class User {
  public id?: number;
  public email: Email;
  public role: string;
  public password?: string;

  constructor(data: { id?: number; email: Email; role: string }) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
  }

  async setPassword(plainPassword: string): Promise<void> {
    this.password = await bcrypt.hash(plainPassword, 10);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(plainPassword, this.password);
  }
}
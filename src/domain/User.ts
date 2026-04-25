import { Email } from './value-objects/Email';

export class User {
  public id?: number;
  public email: Email;
  public role: string;

  constructor(data: { id?: number; email: Email; role: string }) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
  }
}
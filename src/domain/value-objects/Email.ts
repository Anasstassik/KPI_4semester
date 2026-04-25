import { DomainError } from '../errors';

export class Email {
  public readonly value: string;
  constructor(value: string) {
    if (!value || !value.includes('@')) throw new DomainError('Invalid email');
    this.value = value;
  }
}
import { DomainError } from '../errors';

export class DisciplineName {
  public readonly value: string;
  constructor(value: string) {
    if (!value || value.trim().length === 0) throw new DomainError('Name required');
    if (value.length > 100) throw new DomainError('Name too long');
    this.value = value.trim();
  }
}

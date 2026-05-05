import { DomainError } from './errors';

export class Discipline {
  public id?: number;
  public name: string;

  constructor(data: { id?: number; name: string }) {
    this.validate(data.name);
    this.id = data.id;
    this.name = data.name;
  }

  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError("Назва обов'язкова");
    }
  }

  public static create(data: { name: string }): Discipline {
    return new Discipline(data);
  }
}

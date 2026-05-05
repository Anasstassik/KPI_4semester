import { DomainError } from './errors';

export class LabWork {
  public id?: number;
  public title: string;
  public deadline: Date;
  public status: string;
  public disciplineId: number;
  public studentId: number;

  constructor(data: { id?: number; title: string; deadline: Date; status: string; disciplineId: number; studentId: number }) {
    this.validate(data.title);
    this.id = data.id;
    this.title = data.title;
    this.deadline = data.deadline;
    this.status = data.status;
    this.disciplineId = data.disciplineId;
    this.studentId = data.studentId;
  }

  private validate(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new DomainError("Назва лабораторної обов'язкова");
    }
  }
}
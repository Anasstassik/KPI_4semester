import { LabStatus } from './value-objects/LabStatus';

export class Lab {
  public id?: number;
  public title: string;
  public deadline: Date;
  public disciplineId: number;
  public studentId: number;
  public status: LabStatus;

  constructor(data: { 
    id?: number; 
    title: string; 
    deadline: Date; 
    disciplineId: number; 
    studentId: number; 
    status: LabStatus 
  }) {
    this.id = data.id;
    this.title = data.title;
    this.deadline = data.deadline;
    this.disciplineId = data.disciplineId;
    this.studentId = data.studentId;
    this.status = data.status;
  }

  public changeStatus(newStatus: string): void {
    this.status = new LabStatus(newStatus);
  }
}
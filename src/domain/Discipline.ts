import { DisciplineName } from './value-objects/DisciplineName';

export class Discipline {
  public id?: number;
  public name: DisciplineName;

  constructor(data: { id?: number; name: DisciplineName }) {
    this.id = data.id;
    this.name = data.name;
  }
}

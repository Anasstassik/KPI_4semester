import { Discipline } from '../Discipline';
import { DisciplineName } from '../value-objects/DisciplineName';

export class DisciplineFactory {
  static createNew(nameString: string): Discipline {
    const name = new DisciplineName(nameString);
    return new Discipline({ name });
  }
}

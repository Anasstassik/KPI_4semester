import prisma from './database';
import { Discipline } from '../domain/Discipline';

export interface IDisciplineRepository {
  save(discipline: Discipline): Promise<number>;
}

export class DisciplineRepository implements IDisciplineRepository {
  async save(discipline: Discipline): Promise<number> {
    const created = await prisma.discipline.create({
      data: { name: discipline.name.value }
    });
    return created.id;
  }
}

import prisma from './database';
import { Discipline } from '../domain/Discipline';

export interface IDisciplineRepository {
  save(discipline: Discipline): Promise<number>;
  findAll(): Promise<Discipline[]>;
}

export class DisciplineRepository implements IDisciplineRepository {
  async save(discipline: Discipline): Promise<number> {
    const created = await prisma.discipline.create({
      data: { name: discipline.name }
    });
    return created.id;
  }

  async findAll(): Promise<Discipline[]> {
    const data = await prisma.discipline.findMany();
    return data.map(item => new Discipline({ id: item.id, name: item.name }));
  }
}

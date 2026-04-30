import prisma from './database';
import { Lab } from '../domain/Lab';
import { LabStatus } from '../domain/value-objects/LabStatus';

export interface ILabRepository {
  save(lab: Lab): Promise<number>;
  findById(id: number): Promise<Lab | null>;
  update(lab: Lab): Promise<void>;
  delete(id: number): Promise<void>;
}

export class LabRepository implements ILabRepository {
  async save(lab: Lab): Promise<number> {
    const created = await prisma.labWork.create({
      data: {
        title: lab.title,
        deadline: lab.deadline,
        disciplineId: lab.disciplineId,
        studentId: lab.studentId,
        status: lab.status.value
      }
    });
    return created.id;
  }

  async findById(id: number): Promise<Lab | null> {
  const data = await prisma.labWork.findUnique({ where: { id } });
  if (!data) return null;

  return new Lab({
    id: data.id,
    title: data.title,
    deadline: data.deadline,
    disciplineId: data.disciplineId,
    studentId: data.studentId,
    status: new LabStatus(data.status)
  });
}

  async update(lab: Lab): Promise<void> {
    if (!lab.id) return;
    await prisma.labWork.update({
      where: { id: lab.id },
      data: {
        title: lab.title,
        deadline: lab.deadline,
        status: lab.status.value
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.labWork.delete({ where: { id } });
  }
}
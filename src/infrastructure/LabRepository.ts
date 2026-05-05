import prisma from './database';
import { LabWork } from '../domain/LabWork';

export interface ILabRepository {
  save(lab: LabWork): Promise<number>;
  delete(id: number): Promise<void>;
  update(id: number, payload: { title: string; deadline: Date }): Promise<void>;
  updateStatus(id: number, status: string): Promise<void>;
}

export class LabRepository implements ILabRepository {
  async save(lab: LabWork): Promise<number> {
    const created = await prisma.labWork.create({
      data: {
        title: lab.title,
        deadline: new Date(lab.deadline),
        status: lab.status,
        disciplineId: Number(lab.disciplineId),
        studentId: Number(lab.studentId)
      }
    });
    return created.id;
  }

  async delete(id: number): Promise<void> {
    await prisma.labWork.delete({
      where: { id: Number(id) }
    });
  }

  async update(id: number, payload: { title: string; deadline: Date }): Promise<void> {
    await prisma.labWork.update({
      where: { id: Number(id) },
      data: {
        title: payload.title,
        deadline: new Date(payload.deadline)
      }
    });
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await prisma.labWork.update({
      where: { id: Number(id) },
      data: {
        status: String(status)
      }
    });
  }
}
import prisma from '../../../infrastructure/database';
import { GetAllLabsQuery } from '../../queries/labs/GetAllLabsQuery';

export class GetAllLabsHandler {
  async execute(query: GetAllLabsQuery): Promise<any[]> {
    return await prisma.labWork.findMany({
      where: query.studentId ? { studentId: query.studentId } : {},
      include: { discipline: true }
    });
  }
}
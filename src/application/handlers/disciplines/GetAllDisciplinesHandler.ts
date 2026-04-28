import prisma from '../../../infrastructure/database';
import { GetAllDisciplinesQuery } from '../../queries/disciplines/GetAllDisciplinesQuery';

export class GetAllDisciplinesHandler {
  async execute(query: GetAllDisciplinesQuery): Promise<any[]> {
    const disciplines = await prisma.discipline.findMany();
    return disciplines;
  }
}

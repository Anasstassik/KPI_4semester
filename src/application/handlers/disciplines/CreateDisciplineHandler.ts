import { DisciplineFactory } from '../../../domain/factories/DisciplineFactory';
import { DisciplineRepository } from '../../../infrastructure/DisciplineRepository';
import { CreateDisciplineCommand } from '../../commands/disciplines/CreateDisciplineCommand';

export class CreateDisciplineHandler {
  constructor(private disciplineRepo: DisciplineRepository) {}

  async execute(command: CreateDisciplineCommand): Promise<number> {
    const discipline = DisciplineFactory.createNew(command.name);
    return await this.disciplineRepo.save(discipline);
  }
}

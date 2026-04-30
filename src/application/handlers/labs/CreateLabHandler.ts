import { LabFactory } from '../../../domain/factories/LabFactory';
import { LabRepository } from '../../../infrastructure/LabRepository';
import { CreateLabCommand } from '../../commands/labs/CreateLabCommand';

export class CreateLabHandler {
  constructor(private labRepo: LabRepository) {}

  async execute(command: CreateLabCommand): Promise<number> {
    const lab = LabFactory.createNew(
      command.title,
      command.deadline,
      command.disciplineId,
      command.studentId
    );
    return await this.labRepo.save(lab);
  }
}
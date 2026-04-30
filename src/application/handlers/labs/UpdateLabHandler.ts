import { LabRepository } from '../../../infrastructure/LabRepository';
import { UpdateLabCommand } from '../../commands/labs/UpdateLabCommand';
import { DomainError } from '../../../domain/errors';

export class UpdateLabHandler {
  constructor(private labRepo: LabRepository) {}

  async execute(command: UpdateLabCommand): Promise<void> {
    const lab = await this.labRepo.findById(command.id);
    if (!lab) throw new DomainError('Лабораторну не знайдено');

    lab.title = command.title;
    lab.deadline = new Date(command.deadline);
    
    await this.labRepo.update(lab);
  }
}
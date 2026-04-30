import { LabRepository } from '../../../infrastructure/LabRepository';
import { DomainError } from '../../../domain/errors';

export class ChangeLabStatusHandler {
  constructor(private labRepo: LabRepository) {}

  async execute(command: { labId: number; status: string }): Promise<void> {
    const lab = await this.labRepo.findById(command.labId);
    if (!lab) throw new DomainError('Лабораторну не знайдено');

    lab.changeStatus(command.status);
    await this.labRepo.update(lab);
  }
}
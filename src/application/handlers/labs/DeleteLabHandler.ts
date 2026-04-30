import { LabRepository } from '../../../infrastructure/LabRepository';
import { DeleteLabCommand } from '../../commands/labs/DeleteLabCommand';

export class DeleteLabHandler {
  constructor(private labRepo: LabRepository) {}

  async execute(command: DeleteLabCommand): Promise<void> {
    await this.labRepo.delete(command.id);
  }
}
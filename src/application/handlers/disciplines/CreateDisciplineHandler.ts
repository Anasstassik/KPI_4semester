import { DisciplineRepository } from '../../../infrastructure/DisciplineRepository';
import { AuditService } from '../../../infrastructure/services/AuditService';
import { EventBus } from '../../../infrastructure/events/EventBus';
import { CreateDisciplineCommand } from '../../commands/disciplines/CreateDisciplineCommand';
import { Discipline } from '../../../domain/Discipline';

export class CreateDisciplineHandler {
  constructor(
    private repository: DisciplineRepository,
    private auditService: AuditService,
    private eventBus: EventBus
  ) {}

  async execute(command: CreateDisciplineCommand, mode: 'sync' | 'async' = 'sync'): Promise<number> {
    const existingDiscipline = await this.repository.findByName(command.name);
    
    if (existingDiscipline) {
      throw new Error(`Дисципліна з назвою "${command.name}" вже існує`);
    }

    const discipline = new Discipline({ name: command.name });
    const id = await this.repository.save(discipline);

    if (mode === 'sync') {
      try {
        this.auditService.log(`DisciplineCreated_Sync`, { id, name: command.name });
      } catch (error) {
        console.error('Audit failed', error);
      }
    } else {
      this.eventBus.publish('DisciplineCreated', { id, name: command.name });
    }

    return id;
  }
}
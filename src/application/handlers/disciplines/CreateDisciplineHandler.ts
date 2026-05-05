import { IDisciplineRepository } from '../../../infrastructure/DisciplineRepository';
import { IAuditService } from '../../../infrastructure/services/AuditService';
import { EventBus } from '../../../infrastructure/events/EventBus';
import { CreateDisciplineCommand } from '../../commands/disciplines/CreateDisciplineCommand';
import { Discipline } from '../../../domain/Discipline';
import { DisciplineCreatedEvent } from '../../../domain/events/DisciplineCreatedEvent';

export class CreateDisciplineHandler {
  constructor(
    private repository: IDisciplineRepository,
    private auditService: IAuditService,
    private eventBus: EventBus
  ) {}

  async execute(command: CreateDisciplineCommand, mode: 'sync' | 'async' = 'sync'): Promise<number> {
    const discipline = Discipline.create({ name: command.name });
    const id = await this.repository.save(discipline);

    if (mode === 'sync') {
      try {
        this.auditService.log('DisciplineCreated_Sync', { id, name: command.name });
      } catch (error) {
        console.error('Audit failed, but proceeding');
      }
    } else {
      const event = new DisciplineCreatedEvent(id, command.name);
      this.eventBus.publish('DisciplineCreated', event);
    }

    return id;
  }
}

import { ILabRepository } from '../../../infrastructure/LabRepository';
import { INotificationService } from '../../../infrastructure/services/NotificationService';
import { EventBus } from '../../../infrastructure/events/EventBus';
import { CreateLabCommand } from '../../commands/labs/CreateLabCommand';
import { LabWork } from '../../../domain/LabWork';
import { LabWorkCreatedEvent } from '../../../domain/events/LabWorkCreatedEvent';

export class CreateLabHandler {
  constructor(
    private repository: ILabRepository,
    private notificationService: INotificationService,
    private eventBus: EventBus
  ) {}

  async execute(command: CreateLabCommand, mode: 'sync' | 'async' = 'sync'): Promise<number> {
    const lab = new LabWork({
      title: command.title,
      deadline: command.deadline,
      status: 'TODO',
      disciplineId: Number(command.disciplineId),
      studentId: Number(command.studentId)
    });

    const id = await this.repository.save(lab);

    if (mode === 'sync') {
      try {
        this.notificationService.send(`Нова лабораторна: ${command.title}`);
      } catch (error) {
        console.error('Sync notification failed');
      }
    } else {
      const event = new LabWorkCreatedEvent(id, command.title, command.disciplineId);
      this.eventBus.publish('LabWorkCreated', event);
    }

    return id;
  }
}
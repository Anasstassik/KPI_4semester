import { ILabRepository } from '../../../infrastructure/LabRepository';
import { INotificationService } from '../../../infrastructure/services/NotificationService';
import { EventBus } from '../../../infrastructure/events/EventBus';
import { UpdateLabCommand } from '../../commands/labs/UpdateLabCommand';

export class UpdateLabHandler {
  constructor(
    private repository: ILabRepository,
    private notificationService: INotificationService,
    private eventBus: EventBus
  ) {}

  async execute(command: UpdateLabCommand, mode: 'sync' | 'async' = 'sync'): Promise<void> {
    await this.repository.update(command.id, {
      title: command.title,
      deadline: command.deadline
    });

    if (mode === 'sync') {
      try {
        this.notificationService.send(`Дані лабораторної "${command.title}" оновлено`);
      } catch (error) {
        console.error('Sync notification failed');
      }
    } else {
      this.eventBus.publish('LabWorkUpdated', { id: command.id, title: command.title });
    }
  }
}
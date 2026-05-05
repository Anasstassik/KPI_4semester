import { ILabRepository } from '../../../infrastructure/LabRepository';
import { INotificationService } from '../../../infrastructure/services/NotificationService';
import { EventBus } from '../../../infrastructure/events/EventBus';
import { DeleteLabCommand } from '../../commands/labs/DeleteLabCommand';

export class DeleteLabHandler {
  constructor(
    private repository: ILabRepository,
    private notificationService: INotificationService,
    private eventBus: EventBus
  ) {}

  async execute(command: DeleteLabCommand, mode: 'sync' | 'async' = 'sync'): Promise<void> {
    await this.repository.delete(command.id);

    if (mode === 'sync') {
      try {
        this.notificationService.send(`Лабораторну роботу #${command.id} видалено`);
      } catch (error) {
        console.error('Sync notification failed');
      }
    } else {
      this.eventBus.publish('LabWorkDeleted', { id: command.id, timestamp: new Date() });
    }
  }
}
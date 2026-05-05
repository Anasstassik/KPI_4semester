import { ILabRepository } from '../../../infrastructure/LabRepository';
import { INotificationService } from '../../../infrastructure/services/NotificationService';
import { EventBus } from '../../../infrastructure/events/EventBus';
import { ChangeLabStatusCommand } from '../../commands/labs/ChangeLabStatusCommand';

export class ChangeLabStatusHandler {
  constructor(
    private repository: ILabRepository,
    private notificationService: INotificationService,
    private eventBus: EventBus
  ) {}

  async execute(command: ChangeLabStatusCommand, mode: 'sync' | 'async' = 'sync'): Promise<void> {
    await this.repository.updateStatus(command.id, command.status);

    if (mode === 'sync') {
      try {
        this.notificationService.send(`Статус лабораторної #${command.id} змінено на ${command.status}`);
      } catch (error) {
        console.error('Sync notification failed');
      }
    } else {
      this.eventBus.publish('LabWorkStatusChanged', { 
        id: command.id, 
        newStatus: command.status 
      });
    }
  }
}
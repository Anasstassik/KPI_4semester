import { EventBus } from '../../infrastructure/events/EventBus';
import { INotificationService } from '../../infrastructure/services/NotificationService';
import { LabWorkCreatedEvent } from '../../domain/events/LabWorkCreatedEvent';

export class LabWorkCreatedSubscriber {
  constructor(
    private eventBus: EventBus,
    private notificationService: INotificationService
  ) {
    this.eventBus.subscribe('LabWorkCreated', (event: LabWorkCreatedEvent) => {
      this.handle(event);
    });
  }

  private handle(event: LabWorkCreatedEvent): void {
    this.notificationService.send(`[ASYNC] Сповіщення про роботу: ${event.title}`);
  }
}
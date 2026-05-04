import { EventHandler } from '../../infrastructure/events/EventBus';
import { UserRegisteredEvent } from '../../domain/events/UserRegisteredEvent';
import { INotificationService } from '../../infrastructure/services/NotificationService';

export class UserRegisteredSubscriber implements EventHandler<UserRegisteredEvent> {
  constructor(private notificationService: INotificationService) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    await this.notificationService.sendWelcomeEmail(event.email);
  }
}
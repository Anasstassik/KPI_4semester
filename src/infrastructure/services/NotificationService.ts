export interface INotificationService {
  send(message: string): void;
}

export class NotificationService implements INotificationService {
  send(message: string): void {
    console.log(`[NOTIFICATION] ${new Date().toISOString()}: ${message}`);
  }
}
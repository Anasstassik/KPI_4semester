export interface INotificationService {
  sendWelcomeEmail(email: string): Promise<void>;
}

export class NotificationService implements INotificationService {
  async sendWelcomeEmail(email: string): Promise<void> {
    console.log(`SENDING EMAIL TO: ${email}`);
  }
}
import { EventBus } from '../../infrastructure/events/EventBus';
import { IAuditService } from '../../infrastructure/services/AuditService';
import { DisciplineCreatedEvent } from '../../domain/events/DisciplineCreatedEvent';

export class DisciplineCreatedSubscriber {
  constructor(
    private eventBus: EventBus,
    private auditService: IAuditService
  ) {
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    this.eventBus.subscribe('DisciplineCreated', (event: DisciplineCreatedEvent) => {
      this.handle(event);
    });
  }

  private handle(event: DisciplineCreatedEvent): void {
    this.auditService.log('DisciplineCreated_Async', event);
  }
}

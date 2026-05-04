import { DomainEvent } from '../../domain/events/DomainEvent';

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export class EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  publish(eventName: string, event: DomainEvent): void {
    const eventHandlers = this.handlers.get(eventName) || [];
    for (const handler of eventHandlers) {
      handler.handle(event).catch(() => {});
    }
  }
}

export const eventBus = new EventBus();
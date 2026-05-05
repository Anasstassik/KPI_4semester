type EventHandler = (event: any) => void | Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private subscribers: Map<string, EventHandler[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.subscribers.get(eventName) || [];
    handlers.push(handler);
    this.subscribers.set(eventName, handlers);
  }

  public publish(eventName: string, event: any): void {
    const handlers = this.subscribers.get(eventName) || [];
    
    handlers.forEach(handler => {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          result.catch(err => console.error(`Async handler error for ${eventName}:`, err));
        }
      } catch (err) {
        console.error(`Sync handler error for ${eventName}:`, err);
      }
    });
  }
}

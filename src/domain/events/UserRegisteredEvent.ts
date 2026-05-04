import { DomainEvent } from './DomainEvent';

export class UserRegisteredEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(
    public readonly userId: number,
    public readonly email: string
  ) {
    this.occurredOn = new Date();
  }
}
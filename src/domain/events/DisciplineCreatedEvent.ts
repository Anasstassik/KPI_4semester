export class DisciplineCreatedEvent {
  public readonly occurredOn: Date;
  constructor(
    public readonly disciplineId: number,
    public readonly name: string
  ) {
    this.occurredOn = new Date();
  }
}

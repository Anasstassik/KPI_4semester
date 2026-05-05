export class LabWorkCreatedEvent {
  public readonly occurredOn: Date;
  constructor(
    public readonly labId: number,
    public readonly title: string,
    public readonly disciplineId: number
  ) {
    this.occurredOn = new Date();
  }
}
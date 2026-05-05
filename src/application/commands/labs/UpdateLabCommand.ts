export class UpdateLabCommand {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly deadline: Date
  ) {}
}
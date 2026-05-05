export class CreateLabCommand {
  constructor(
    public readonly title: string,
    public readonly deadline: Date,
    public readonly disciplineId: number,
    public readonly studentId: number
  ) {}
}
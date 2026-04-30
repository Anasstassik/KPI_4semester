export class CreateLabCommand {
  constructor(
    public readonly title: string,
    public readonly deadline: string,
    public readonly disciplineId: number,
    public readonly studentId: number
  ) {}
}
export class ChangeLabStatusCommand {
  constructor(
    public readonly labId: number,
    public readonly status: string
  ) {}
}
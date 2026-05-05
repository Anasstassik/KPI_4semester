export class ChangeLabStatusCommand {
  constructor(
    public readonly id: number,
    public readonly status: string
  ) {}
}
import { Request, Response } from 'express';
import { CreateLabHandler } from '../application/handlers/labs/CreateLabHandler';
import { ChangeLabStatusHandler } from '../application/handlers/labs/ChangeLabStatusHandler';
import { DomainError } from '../domain/errors';

export class LabController {
  constructor(
    private createLabHandler: CreateLabHandler,
    private changeStatusHandler: ChangeLabStatusHandler
  ) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = await this.createLabHandler.execute(req.body);
      res.status(201).json({ id });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await this.changeStatusHandler.execute({ labId: Number(id), status });
      res.status(200).send();
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: any) {
    if (error instanceof DomainError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }
}
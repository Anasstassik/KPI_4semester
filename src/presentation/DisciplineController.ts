import { Request, Response } from 'express';
import { CreateDisciplineHandler } from '../application/handlers/disciplines/CreateDisciplineHandler';
import { GetAllDisciplinesHandler } from '../application/handlers/disciplines/GetAllDisciplinesHandler';
import { CreateDisciplineCommand } from '../application/commands/disciplines/CreateDisciplineCommand';
import { GetAllDisciplinesQuery } from '../application/queries/disciplines/GetAllDisciplinesQuery';
import { DomainError } from '../domain/errors';

export class DisciplineController {
  constructor(
    private createDisciplineHandler: CreateDisciplineHandler,
    private getAllDisciplinesHandler: GetAllDisciplinesHandler
  ) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const command = new CreateDisciplineCommand(req.body.name);
      const id = await this.createDisciplineHandler.execute(command);
      res.status(201).json({ id });
    } catch (error) {
      if (error instanceof DomainError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
      }
    }
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = new GetAllDisciplinesQuery();
      const disciplines = await this.getAllDisciplinesHandler.execute(query);
      res.status(200).json(disciplines);
    } catch (error) {
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }
}

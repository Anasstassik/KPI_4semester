import { Request, Response } from 'express';
import { RegisterUserHandler } from '../application/handlers/auth/RegisterUserHandler';
import { DomainError } from '../domain/errors';

export class AuthController {
  constructor(private registerUserHandler: RegisterUserHandler) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, role } = req.body;
      const userId = await this.registerUserHandler.execute({ email, role });
      res.status(201).json({ id: userId });
    } catch (error) {
      if (error instanceof DomainError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
      }
    }
  }
}
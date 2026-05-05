import { Router } from 'express';
import { DisciplineRepository } from '../../infrastructure/DisciplineRepository';
import { AuditService } from '../../infrastructure/services/AuditService';
import { EventBus } from '../../infrastructure/events/EventBus';
import { CreateDisciplineHandler } from '../../application/handlers/disciplines/CreateDisciplineHandler';
import { CreateDisciplineCommand } from '../../application/commands/disciplines/CreateDisciplineCommand';
import { DisciplineCreatedSubscriber } from '../../application/subscribers/DisciplineCreatedSubscriber';
import { authenticate } from '../authMiddleware';

const disciplineRouter = Router();
const repository = new DisciplineRepository();
const auditService = new AuditService();
const eventBus = EventBus.getInstance();

new DisciplineCreatedSubscriber(eventBus, auditService);

const createHandler = new CreateDisciplineHandler(repository, auditService, eventBus);

disciplineRouter.post('/disciplines', authenticate, async (req, res) => {
  try {
    const mode = req.query.mode === 'async' ? 'async' : 'sync';
    const command = new CreateDisciplineCommand(req.body.name);
    const id = await createHandler.execute(command, mode);
    res.status(201).json({ id, communication: mode });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

disciplineRouter.get('/disciplines', authenticate, async (req, res) => {
  try {
    const data = await repository.findAll();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { disciplineRouter };

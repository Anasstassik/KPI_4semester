import { Router } from 'express';
import { LabRepository } from '../../infrastructure/LabRepository';
import { NotificationService } from '../../infrastructure/services/NotificationService';
import { EventBus } from '../../infrastructure/events/EventBus';
import { CreateLabHandler } from '../../application/handlers/labs/CreateLabHandler';
import { CreateLabCommand } from '../../application/commands/labs/CreateLabCommand';
import { LabWorkCreatedSubscriber } from '../../application/subscribers/LabWorkCreatedSubscriber';
import { authenticate } from '../authMiddleware';

const labRouter = Router();
const repository = new LabRepository();
const notificationService = new NotificationService();
const eventBus = EventBus.getInstance();

new LabWorkCreatedSubscriber(eventBus, notificationService);

const createHandler = new CreateLabHandler(repository, notificationService, eventBus);

labRouter.post('/labs', authenticate, async (req, res) => {
  try {
    const mode = req.query.mode === 'async' ? 'async' : 'sync';
    const studentId = req.body.studentId || (req as any).user.id;
    
    const command = new CreateLabCommand(
      req.body.title,
      new Date(req.body.deadline),
      Number(req.body.disciplineId),
      Number(studentId)
    );
    
    const id = await createHandler.execute(command, mode);
    res.status(201).json({ id, communication: mode });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export { labRouter };
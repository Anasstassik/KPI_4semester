import express from 'express';
import { RegisterUserHandler } from './application/handlers/auth/RegisterUserHandler';
import { AuthController } from './presentation/AuthController';
import { DisciplineRepository } from './infrastructure/DisciplineRepository';
import { CreateDisciplineHandler } from './application/handlers/disciplines/CreateDisciplineHandler';
import { GetAllDisciplinesHandler } from './application/handlers/disciplines/GetAllDisciplinesHandler';
import { DisciplineController } from './presentation/DisciplineController';
import { LabRepository } from './infrastructure/LabRepository';
import { CreateLabHandler } from './application/handlers/labs/CreateLabHandler';
import { ChangeLabStatusHandler } from './application/handlers/labs/ChangeLabStatusHandler';
import { LabController } from './presentation/LabController';
import { authenticate } from './presentation/authMiddleware';

const app = express();

app.use(express.json());

const registerUserHandler = new RegisterUserHandler();
const authController = new AuthController(registerUserHandler);

const disciplineRepository = new DisciplineRepository();
const createDisciplineHandler = new CreateDisciplineHandler(disciplineRepository);
const getAllDisciplinesHandler = new GetAllDisciplinesHandler();
const disciplineController = new DisciplineController(createDisciplineHandler, getAllDisciplinesHandler);

const labRepository = new LabRepository();
const createLabHandler = new CreateLabHandler(labRepository);
const changeLabStatusHandler = new ChangeLabStatusHandler(labRepository);
const labController = new LabController(createLabHandler, changeLabStatusHandler);

app.post('/api/auth/register', authController.register);

app.post('/api/disciplines', authenticate, disciplineController.create);
app.get('/api/disciplines', authenticate, disciplineController.getAll);

app.post('/api/labs', authenticate, labController.create);
app.patch('/api/labs/:id/status', authenticate, labController.changeStatus);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const UserRepository = require('./infrastructure/UserRepository');
const DisciplineRepository = require('./infrastructure/DisciplineRepository');
const LabRepository = require('./infrastructure/LabRepository');

const RegisterUserHandler = require('./application/handlers/auth/RegisterUserHandler');
const LoginUserHandler = require('./application/handlers/auth/LoginUserHandler');
const DisciplineUseCases = require('./application/DisciplineUseCases');
const LabUseCases = require('./application/LabUseCases');

const AuthController = require('./presentation/AuthController');
const DisciplineController = require('./presentation/DisciplineController');
const LabController = require('./presentation/LabController');

const { authenticateToken, JWT_SECRET } = require('./presentation/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

const userRepository = new UserRepository();
const disciplineRepository = new DisciplineRepository();
const labRepository = new LabRepository();

const registerUserHandler = new RegisterUserHandler(userRepository);
const loginUserHandler = new LoginUserHandler(JWT_SECRET);
const authController = new AuthController(registerUserHandler, loginUserHandler);

const disciplineUseCases = new DisciplineUseCases(disciplineRepository);
const labUseCases = new LabUseCases(labRepository);

const disciplineController = new DisciplineController(disciplineUseCases);
const labController = new LabController(labUseCases);

app.post('/api/register', (req, res) => authController.register(req, res));
app.post('/api/login', (req, res) => authController.login(req, res));

app.post('/api/disciplines', authenticateToken, (req, res) => disciplineController.create(req, res));
app.get('/api/disciplines', authenticateToken, (req, res) => disciplineController.getAll(req, res));

app.post('/api/labs', authenticateToken, (req, res) => labController.create(req, res));
app.get('/api/labs', authenticateToken, (req, res) => labController.getAll(req, res));
app.put('/api/labs/:id', authenticateToken, (req, res) => labController.update(req, res));
app.patch('/api/labs/:id/status', authenticateToken, (req, res) => labController.changeStatus(req, res));
app.delete('/api/labs/:id', authenticateToken, (req, res) => labController.delete(req, res));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));
}

module.exports = { app, authenticateToken };
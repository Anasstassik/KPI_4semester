const express = require('express');
const cors = require('cors');
require('dotenv').config();

const UserRepository = require('./infrastructure/UserRepository');
const DisciplineRepository = require('./infrastructure/DisciplineRepository');

const AuthUseCases = require('./application/AuthUseCases');
const DisciplineUseCases = require('./application/DisciplineUseCases');

const AuthController = require('./presentation/AuthController');
const DisciplineController = require('./presentation/DisciplineController');

const { authenticateToken, JWT_SECRET } = require('./presentation/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

const userRepository = new UserRepository();
const disciplineRepository = new DisciplineRepository();

const authUseCases = new AuthUseCases(userRepository, JWT_SECRET);
const disciplineUseCases = new DisciplineUseCases(disciplineRepository);

const authController = new AuthController(authUseCases);
const disciplineController = new DisciplineController(disciplineUseCases);

app.post('/api/register', (req, res) => authController.register(req, res));
app.post('/api/login', (req, res) => authController.login(req, res));

app.post('/api/disciplines', authenticateToken, (req, res) => disciplineController.create(req, res));
app.get('/api/disciplines', authenticateToken, (req, res) => disciplineController.getAll(req, res));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));
}

module.exports = { app, authenticateToken };

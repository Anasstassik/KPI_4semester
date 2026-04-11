const express = require('express');
const cors = require('cors');
require('dotenv').config();

const UserRepository = require('./infrastructure/UserRepository');
const AuthUseCases = require('./application/AuthUseCases');
const AuthController = require('./presentation/AuthController');
const { authenticateToken, JWT_SECRET } = require('./presentation/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

const userRepository = new UserRepository();
const authUseCases = new AuthUseCases(userRepository, JWT_SECRET);
const authController = new AuthController(authUseCases);

app.post('/api/register', (req, res) => authController.register(req, res));
app.post('/api/login', (req, res) => authController.login(req, res));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));
}

module.exports = { app, authenticateToken };
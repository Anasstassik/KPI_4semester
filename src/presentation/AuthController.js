const RegisterUserCommand = require('../application/commands/auth/RegisterUserCommand');
const LoginUserQuery = require('../application/queries/auth/LoginUserQuery');

class AuthController {
  constructor(registerHandler, loginHandler) {
    this.registerHandler = registerHandler;
    this.loginHandler = loginHandler;
  }

  async register(req, res) {
    try {
      const command = new RegisterUserCommand(req.body);
      const result = await this.registerHandler.execute(command);
      
      res.status(201).json(result);
    } catch (error) {
      if (error.name === 'DomainError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }

  async login(req, res) {
    try {
      const query = new LoginUserQuery(req.body);
      const result = await this.loginHandler.execute(query);
      
      res.status(200).json(result);
    } catch (error) {
      if (error.name === 'DomainError') {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }
}

module.exports = AuthController;
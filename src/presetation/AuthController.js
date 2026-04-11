class AuthController {
  constructor(authUseCases) {
    this.authUseCases = authUseCases;
  }

  async register(req, res) {
    try {
      const user = await this.authUseCases.register(req.body);
      res.status(201).json({ message: 'Створено', userId: user.id });
    } catch (error) {
      if (error.name === 'DomainError') {
        const status = error.message === 'Email вже використовується' ? 409 : 400;
        return res.status(status).json({ error: error.message });
      }
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  async login(req, res) {
    try {
      const result = await this.authUseCases.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error.name === 'DomainError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }
}

module.exports = AuthController;
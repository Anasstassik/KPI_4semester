const CreateDisciplineCommand = require('../application/commands/disciplines/CreateDisciplineCommand');
const GetAllDisciplinesQuery = require('../application/queries/disciplines/GetAllDisciplinesQuery');

class DisciplineController {
  constructor(createHandler, getAllHandler) {
    this.createHandler = createHandler;
    this.getAllHandler = getAllHandler;
  }

  async create(req, res) {
    try {
      const command = new CreateDisciplineCommand(req.body, req.user.role);
      const result = await this.createHandler.execute(command);
      res.status(201).json(result);
    } catch (error) {
      if (error.name === 'DomainError') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }

  async getAll(req, res) {
    try {
      const query = new GetAllDisciplinesQuery();
      const result = await this.getAllHandler.execute(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }
}

module.exports = DisciplineController;

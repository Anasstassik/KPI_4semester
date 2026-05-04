const CreateLabCommand = require('../application/commands/labs/CreateLabCommand');
const UpdateLabCommand = require('../application/commands/labs/UpdateLabCommand');
const ChangeLabStatusCommand = require('../application/commands/labs/ChangeLabStatusCommand');
const DeleteLabCommand = require('../application/commands/labs/DeleteLabCommand');
const GetAllLabsQuery = require('../application/queries/labs/GetAllLabsQuery');

class LabController {
  constructor(createHandler, getAllHandler, updateHandler, changeStatusHandler, deleteHandler) {
    this.createHandler = createHandler;
    this.getAllHandler = getAllHandler;
    this.updateHandler = updateHandler;
    this.changeStatusHandler = changeStatusHandler;
    this.deleteHandler = deleteHandler;
  }

  async create(req, res) {
    try {
      const command = new CreateLabCommand(req.body, req.user.role);
      const result = await this.createHandler.execute(command);
      res.status(201).json(result);
    } catch (error) {
      if (error.name === 'DomainError') {
        const statusCode = error.message.includes('Тільки викладач') ? 403 : 400;
        return res.status(statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }

  async getAll(req, res) {
    try {
      const query = new GetAllLabsQuery();
      const result = await this.getAllHandler.execute(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }

  async update(req, res) {
    try {
      const command = new UpdateLabCommand(req.params.id, req.body, req.user.role);
      await this.updateHandler.execute(command);
      res.status(204).send();
    } catch (error) {
      if (error.name === 'DomainError') return res.status(400).json({ error: error.message });
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }

  async changeStatus(req, res) {
    try {
      const command = new ChangeLabStatusCommand(req.params.id, req.body.status, req.user.role);
      await this.changeStatusHandler.execute(command);
      res.status(204).send();
    } catch (error) {
      if (error.name === 'DomainError') return res.status(400).json({ error: error.message });
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }

  async delete(req, res) {
    try {
      const command = new DeleteLabCommand(req.params.id, req.user.role);
      await this.deleteHandler.execute(command);
      res.status(204).send();
    } catch (error) {
      if (error.name === 'DomainError') return res.status(403).json({ error: error.message });
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }
}
module.exports = LabController;
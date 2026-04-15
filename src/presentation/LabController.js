class LabController {
  constructor(labUseCases) {
    this.labUseCases = labUseCases;
  }

  async create(req, res) {
    try {
      const lab = await this.labUseCases.create(req.body, req.user.role);
      res.status(201).json(lab);
    } catch (error) {
      if (error.name === 'DomainError') {
        if (error.message === 'Доступ заборонено') return res.status(403).json({ error: error.message });
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Помилка при створенні лаби' });
    }
  }

  async getAll(req, res) {
    try {
      const labs = await this.labUseCases.getAll();
      res.json(labs);
    } catch (error) {
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  async update(req, res) {
    try {
      const lab = await this.labUseCases.update(req.params.id, req.body, req.user.role);
      res.json(lab);
    } catch (error) {
      if (error.name === 'DomainError') {
        if (error.message === 'Тільки викладач може редагувати лабораторні') return res.status(403).json({ error: error.message });
        if (error.message === 'Лабораторну роботу не знайдено') return res.status(404).json({ error: error.message });
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  async changeStatus(req, res) {
    try {
      const lab = await this.labUseCases.changeStatus(req.params.id, req.body.status);
      res.json(lab);
    } catch (error) {
      if (error.name === 'DomainError') {
        if (error.message === 'Лабораторну не знайдено') return res.status(404).json({ error: error.message });
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  async delete(req, res) {
    try {
      await this.labUseCases.delete(req.params.id, req.user.role);
      res.status(204).send();
    } catch (error) {
      if (error.name === 'DomainError') {
        if (error.message === 'Тільки викладач може видаляти лабораторні') return res.status(403).json({ error: error.message });
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }
}

module.exports = LabController;
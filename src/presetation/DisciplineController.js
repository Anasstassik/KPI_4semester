class DisciplineController {
  constructor(disciplineUseCases) {
    this.disciplineUseCases = disciplineUseCases;
  }

  async create(req, res) {
    try {
      const discipline = await this.disciplineUseCases.create(req.body, req.user.role);
      res.status(201).json(discipline);
    } catch (error) {
      if (error.name === 'DomainError') {
        if (error.message === 'Тільки викладач може створювати дисципліни') return res.status(403).json({ error: error.message });
        if (error.message === 'Така дисципліна вже існує') return res.status(409).json({ error: error.message });
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  async getAll(req, res) {
    try {
      const disciplines = await this.disciplineUseCases.getAll();
      res.json(disciplines);
    } catch (error) {
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }
}

module.exports = DisciplineController;

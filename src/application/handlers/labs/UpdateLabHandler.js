const { DomainError } = require('../../../domain/errors');

class UpdateLabHandler {
  constructor(labRepository) {
    this.labRepository = labRepository;
  }

  async execute(command) {
    if (command.userRole !== 'TEACHER') {
      throw new DomainError('Тільки викладач може редагувати лабораторні роботи');
    }

    const lab = await this.labRepository.findById(command.id);
    if (!lab) throw new DomainError('Лабораторна робота не знайдена');

    lab.title = command.title || lab.title;
    if (command.deadline) {
      lab.deadline = new Date(command.deadline);
    }

    await this.labRepository.update(lab);
    return {};
  }
}
module.exports = UpdateLabHandler;
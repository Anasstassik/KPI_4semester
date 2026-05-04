const { DomainError } = require('../../../domain/errors');

class DeleteLabHandler {
  constructor(labRepository) {
    this.labRepository = labRepository;
  }

  async execute(command) {
    if (command.userRole !== 'TEACHER') {
      throw new DomainError('Тільки викладач може видаляти лабораторні роботи');
    }

    const lab = await this.labRepository.findById(command.id);
    if (!lab) throw new DomainError('Лабораторна робота не знайдена');

    await this.labRepository.delete(command.id);
    return {};
  }
}
module.exports = DeleteLabHandler;
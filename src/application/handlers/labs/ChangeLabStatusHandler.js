const { DomainError } = require('../../../domain/errors');

class ChangeLabStatusHandler {
  constructor(labRepository) {
    this.labRepository = labRepository;
  }

  async execute(command) {
    const lab = await this.labRepository.findById(command.id);
    if (!lab) throw new DomainError('Лабораторна робота не знайдена');

    lab.updateStatus(command.status);
    await this.labRepository.update(lab);
    return {};
  }
}
module.exports = ChangeLabStatusHandler;
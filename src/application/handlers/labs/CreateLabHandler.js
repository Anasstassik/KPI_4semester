const Lab = require('../../../domain/Lab');
const { DomainError } = require('../../../domain/errors');

class CreateLabHandler {
  constructor(labRepository) {
    this.labRepository = labRepository;
  }

  async execute(command) {
    if (command.userRole !== 'TEACHER') {
      throw new DomainError('Тільки викладач може створювати лабораторні роботи');
    }

    const lab = Lab.create({
      title: command.title,
      deadline: command.deadline,
      disciplineId: command.disciplineId
    });

    const savedLab = await this.labRepository.save(lab);
    return { labId: savedLab.id };
  }
}
module.exports = CreateLabHandler;
const Discipline = require('../../../domain/Discipline');
const { DomainError } = require('../../../domain/errors');

class CreateDisciplineHandler {
  constructor(disciplineRepository) {
    this.disciplineRepository = disciplineRepository;
  }

  async execute(command) {
    if (command.userRole !== 'TEACHER') {
      throw new DomainError('Тільки викладач може створювати дисципліни');
    }

    const discipline = Discipline.create({ name: command.name });

    const existing = await this.disciplineRepository.findByName(discipline.name);
    if (existing) {
      throw new DomainError('Дисципліна з такою назвою вже існує');
    }

    const savedDiscipline = await this.disciplineRepository.save(discipline);
    return { disciplineId: savedDiscipline.id };
  }
}

module.exports = CreateDisciplineHandler;

const Discipline = require('../domain/Discipline');
const { DomainError } = require('../domain/errors');

class DisciplineUseCases {
  constructor(disciplineRepository) {
    this.disciplineRepository = disciplineRepository;
  }

  async create(data, userRole) {
    if (userRole !== 'TEACHER') {
      throw new DomainError('Тільки викладач може створювати дисципліни');
    }

    const discipline = Discipline.create(data);

    const existing = await this.disciplineRepository.findByName(discipline.name);
    if (existing) {
      throw new DomainError('Така дисципліна вже існує');
    }

    return await this.disciplineRepository.save(discipline);
  }

  async getAll() {
    return await this.disciplineRepository.findAll();
  }
}

module.exports = DisciplineUseCases;

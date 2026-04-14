const Lab = require('../domain/Lab');
const { DomainError } = require('../domain/errors');

class LabUseCases {
  constructor(labRepository) {
    this.labRepository = labRepository;
  }

  async create(data, userRole) {
    if (userRole !== 'TEACHER') {
      throw new DomainError('Доступ заборонено');
    }
    const lab = Lab.create(data);
    return await this.labRepository.save(lab);
  }

  async getAll() {
    return await this.labRepository.findAll();
  }

  async update(id, data, userRole) {
    if (userRole !== 'TEACHER') {
      throw new DomainError('Тільки викладач може редагувати лабораторні');
    }
    const lab = await this.labRepository.findById(id);
    if (!lab) {
      throw new DomainError('Лабораторну роботу не знайдено');
    }
    lab.updateDetails(data);
    return await this.labRepository.update(lab);
  }

  async changeStatus(id, status) {
    const lab = await this.labRepository.findById(id);
    if (!lab) {
      throw new DomainError('Лабораторну не знайдено');
    }
    lab.updateStatus(status);
    return await this.labRepository.update(lab);
  }

  async delete(id, userRole) {
    if (userRole !== 'TEACHER') {
      throw new DomainError('Тільки викладач може видаляти лабораторні');
    }
    const lab = await this.labRepository.findById(id);
    if (!lab) {
      throw new DomainError('Лабораторну роботу не знайдено');
    }
    await this.labRepository.delete(id);
  }
}

module.exports = LabUseCases;
const { DomainError } = require('./errors');

class Discipline {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  static create({ name }) {
    if (!name) {
      throw new DomainError('Назва обов\'язкова');
    }
    return new Discipline({ name });
  }
}

module.exports = Discipline;

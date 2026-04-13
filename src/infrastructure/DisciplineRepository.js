const prisma = require('./database');
const Discipline = require('../domain/Discipline');

class DisciplineRepository {
  async findByName(name) {
    const data = await prisma.discipline.findUnique({ where: { name } });
    if (!data) return null;
    return new Discipline(data);
  }

  async findAll() {
    return await prisma.discipline.findMany();
  }

  async save(discipline) {
    const data = await prisma.discipline.create({
      data: { name: discipline.name }
    });
    return new Discipline(data);
  }
}

module.exports = DisciplineRepository;

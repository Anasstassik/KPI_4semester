const prisma = require('./database');
const Lab = require('../domain/Lab');

class LabRepository {
  async save(lab) {
    const data = await prisma.labWork.create({
      data: {
        title: lab.title,
        description: lab.description,
        deadline: lab.deadline,
        disciplineId: lab.disciplineId,
        status: lab.status
      }
    });
    return new Lab(data);
  }

  async findAll() {
    return await prisma.labWork.findMany({
      include: { discipline: true },
      orderBy: { deadline: 'asc' }
    });
  }

  async findById(id) {
    const data = await prisma.labWork.findUnique({ where: { id: parseInt(id) } });
    if (!data) return null;
    return new Lab(data);
  }

  async update(lab) {
    const data = await prisma.labWork.update({
      where: { id: lab.id },
      data: {
        title: lab.title,
        description: lab.description,
        deadline: lab.deadline,
        status: lab.status
      }
    });
    return new Lab(data);
  }

  async delete(id) {
    await prisma.labWork.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = LabRepository;
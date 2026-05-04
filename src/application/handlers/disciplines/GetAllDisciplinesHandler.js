const prisma = require('../../../infrastructure/database');

class GetAllDisciplinesHandler {
  async execute(query) {
    const disciplines = await prisma.discipline.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: { name: 'asc' }
    });
    return disciplines;
  }
}

module.exports = GetAllDisciplinesHandler;

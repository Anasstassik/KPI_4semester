const prisma = require('../../../infrastructure/database');

class GetAllLabsHandler {
  async execute(query) {
    return await prisma.labWork.findMany({
      include: { discipline: true },
      orderBy: { deadline: 'asc' }
    });
  }
}
module.exports = GetAllLabsHandler;
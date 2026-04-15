const LabUseCases = require('../../../src/application/LabUseCases');
const Lab = require('../../../src/domain/Lab');
const { DomainError } = require('../../../src/domain/errors');

describe('LabUseCases', () => {
  let mockLabRepo;
  let useCases;

  beforeEach(() => {
    mockLabRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn()
    };
    useCases = new LabUseCases(mockLabRepo);
  });

  it('вчитель може створити лабу', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    mockLabRepo.save.mockImplementation(async (l) => {
      l.id = 1;
      return l;
    });

    const lab = await useCases.create({ 
      title: 'Lab 1', 
      deadline: futureDate.toISOString(), 
      disciplineId: 1 
    }, 'TEACHER');

    expect(lab.id).toBe(1);
    expect(mockLabRepo.save).toHaveBeenCalled();
  });

  it('студент отримує помилку при створенні лаби', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    await expect(
      useCases.create({ title: 'Lab 1', deadline: futureDate, disciplineId: 1 }, 'STUDENT')
    ).rejects.toThrow(DomainError);
  });

  it('повинен оновлювати статус і викликати репозиторій', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const existingLab = Lab.create({ title: 'Lab', deadline: futureDate, disciplineId: 1 });
    existingLab.id = 1;

    mockLabRepo.findById.mockResolvedValue(existingLab);
    mockLabRepo.update.mockResolvedValue(existingLab);

    await useCases.changeStatus(1, 'Здано');
    
    expect(existingLab.status).toBe('Здано');
    expect(mockLabRepo.update).toHaveBeenCalledWith(existingLab);
  });
});
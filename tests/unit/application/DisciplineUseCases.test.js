const DisciplineUseCases = require('../../../src/application/DisciplineUseCases');
const Discipline = require('../../../src/domain/Discipline');
const { DomainError } = require('../../../src/domain/errors');

describe('DisciplineUseCases', () => {
  let mockDisciplineRepo;
  let useCases;

  beforeEach(() => {
    mockDisciplineRepo = {
      findByName: jest.fn(),
      save: jest.fn()
    };
    useCases = new DisciplineUseCases(mockDisciplineRepo);
  });

  it('повинен створювати дисципліну якщо користувач TEACHER', async () => {
    mockDisciplineRepo.findByName.mockResolvedValue(null);
    mockDisciplineRepo.save.mockImplementation(async (d) => {
      d.id = 1;
      return d;
    });

    const discipline = await useCases.create({ name: 'Фізика' }, 'TEACHER');
    expect(discipline.id).toBe(1);
    expect(mockDisciplineRepo.save).toHaveBeenCalled();
  });

  it('повинен кидати помилку якщо користувач не TEACHER', async () => {
    await expect(
      useCases.create({ name: 'Фізика' }, 'STUDENT')
    ).rejects.toThrow(DomainError);
  });

  it('повинен кидати помилку якщо дисципліна вже існує', async () => {
    mockDisciplineRepo.findByName.mockResolvedValue(new Discipline({ id: 1, name: 'Фізика' }));

    await expect(
      useCases.create({ name: 'Фізика' }, 'TEACHER')
    ).rejects.toThrow(DomainError);
  });
});

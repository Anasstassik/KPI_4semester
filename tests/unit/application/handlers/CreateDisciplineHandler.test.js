const CreateDisciplineHandler = require('../../../../src/application/handlers/disciplines/CreateDisciplineHandler');
const { DomainError } = require('../../../../src/domain/errors');

describe('CreateDisciplineHandler (Unit)', () => {
  let mockRepo;
  let handler;

  beforeEach(() => {
    mockRepo = {
      findByName: jest.fn(),
      save: jest.fn()
    };
    handler = new CreateDisciplineHandler(mockRepo);
  });

  it('має створювати дисципліну (TEACHER)', async () => {
    mockRepo.findByName.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue({ id: 1 });

    const result = await handler.execute({ name: 'Фізика', userRole: 'TEACHER' });

    expect(mockRepo.save).toHaveBeenCalled();
    expect(result).toEqual({ disciplineId: 1 });
  });

  it('помилка якщо не TEACHER', async () => {
    await expect(
      handler.execute({ name: 'Фізика', userRole: 'STUDENT' })
    ).rejects.toThrow(DomainError);
  });
});

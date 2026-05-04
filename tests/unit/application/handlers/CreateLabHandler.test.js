const CreateLabHandler = require('../../../../src/application/handlers/labs/CreateLabHandler');
const { DomainError } = require('../../../../src/domain/errors');

describe('CreateLabHandler (Unit)', () => {
  let mockRepo;
  let handler;

  beforeEach(() => {
    mockRepo = { save: jest.fn() };
    handler = new CreateLabHandler(mockRepo);
  });

  it('вчитель може створити лабу', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    mockRepo.save.mockResolvedValue({ id: 1 });

    const result = await handler.execute({
      title: 'Lab 1',
      deadline: futureDate.toISOString(),
      disciplineId: 1,
      userRole: 'TEACHER'
    });

    expect(mockRepo.save).toHaveBeenCalled();
    expect(result).toEqual({ labId: 1 });
  });

  it('студент отримує помилку', async () => {
    await expect(
      handler.execute({ title: 'Lab 1', deadline: new Date(), disciplineId: 1, userRole: 'STUDENT' })
    ).rejects.toThrow(DomainError);
  });
});
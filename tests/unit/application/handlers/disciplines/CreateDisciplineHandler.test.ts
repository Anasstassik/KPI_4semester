import { CreateDisciplineHandler } from '../../../../../src/application/handlers/disciplines/CreateDisciplineHandler';
import { CreateDisciplineCommand } from '../../../../../src/application/commands/disciplines/CreateDisciplineCommand';
import { IDisciplineRepository } from '../../../../../src/infrastructure/DisciplineRepository';
import { IAuditService } from '../../../../../src/infrastructure/services/AuditService';
import { EventBus } from '../../../../../src/infrastructure/events/EventBus';

describe('CreateDisciplineHandler (Lab 4)', () => {
  let mockRepo: jest.Mocked<IDisciplineRepository>;
  let mockAudit: jest.Mocked<IAuditService>;
  let mockEventBus: jest.Mocked<EventBus>;
  let handler: CreateDisciplineHandler;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockResolvedValue(1),
      findAll: jest.fn()
    };
    mockAudit = {
      log: jest.fn()
    };
    mockEventBus = {
      publish: jest.fn(),
      subscribe: jest.fn()
    } as any;

    handler = new CreateDisciplineHandler(mockRepo, mockAudit, mockEventBus);
  });

  it('should call audit service in sync mode', async () => {
    const command = new CreateDisciplineCommand('Math');
    await handler.execute(command, 'sync');

    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockAudit.log).toHaveBeenCalledWith('DisciplineCreated_Sync', expect.any(Object));
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it('should publish event in async mode', async () => {
    const command = new CreateDisciplineCommand('History');
    await handler.execute(command, 'async');

    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalledWith('DisciplineCreated', expect.any(Object));
    expect(mockAudit.log).not.toHaveBeenCalled();
  });

  it('should not fail if sync audit fails', async () => {
    mockAudit.log.mockImplementation(() => {
      throw new Error('Audit service down');
    });

    const command = new CreateDisciplineCommand('Physics');
    const result = await handler.execute(command, 'sync');

    expect(result).toBe(1);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});

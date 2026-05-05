import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { CreateDisciplineHandler } from '../../../../../src/application/handlers/disciplines/CreateDisciplineHandler';
import { CreateDisciplineCommand } from '../../../../../src/application/commands/disciplines/CreateDisciplineCommand';
import { IDisciplineRepository } from '../../../../../src/infrastructure/DisciplineRepository';
import { AuditService } from '../../../../../src/infrastructure/services/AuditService';
import { EventBus } from '../../../../../src/infrastructure/events/EventBus';

describe('CreateDisciplineHandler', () => {
  let mockRepo: jest.Mocked<IDisciplineRepository>;
  let mockAudit: jest.Mocked<AuditService>;
  let mockEventBus: jest.Mocked<EventBus>;
  let handler: CreateDisciplineHandler;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn<any>().mockResolvedValue(10),
      findAll: jest.fn<any>().mockResolvedValue([]),
      findByName: jest.fn<any>().mockResolvedValue(null)
    };
    
    mockAudit = {
      log: jest.fn<any>()
    } as any;
    
    mockEventBus = {
      publish: jest.fn<any>(),
      subscribe: jest.fn<any>()
    } as any;

    handler = new CreateDisciplineHandler(mockRepo, mockAudit, mockEventBus);
  });

  it('should save discipline and call audit log in sync mode', async () => {
    const command = new CreateDisciplineCommand('Math');
    const id = await handler.execute(command, 'sync');

    expect(id).toBe(10);
    expect(mockRepo.findByName).toHaveBeenCalledWith('Math');
    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockAudit.log).toHaveBeenCalledWith('DisciplineCreated_Sync', expect.any(Object));
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it('should save discipline and publish event in async mode', async () => {
    const command = new CreateDisciplineCommand('Physics');
    await handler.execute(command, 'async');

    expect(mockRepo.findByName).toHaveBeenCalledWith('Physics');
    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalledWith('DisciplineCreated', expect.any(Object));
    expect(mockAudit.log).not.toHaveBeenCalled();
  });

  it('should throw an error if discipline already exists', async () => {
    mockRepo.findByName.mockResolvedValueOnce({ id: 1, name: 'Chemistry' });

    const command = new CreateDisciplineCommand('Chemistry');

    await expect(handler.execute(command, 'sync')).rejects.toThrow('Дисципліна з назвою "Chemistry" вже існує');
    
    expect(mockRepo.save).not.toHaveBeenCalled();
    expect(mockAudit.log).not.toHaveBeenCalled();
  });
});

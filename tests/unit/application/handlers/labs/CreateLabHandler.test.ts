import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { CreateLabHandler } from '../../../../../src/application/handlers/labs/CreateLabHandler';
import { CreateLabCommand } from '../../../../../src/application/commands/labs/CreateLabCommand';
import { ILabRepository } from '../../../../../src/infrastructure/LabRepository';
import { INotificationService } from '../../../../../src/infrastructure/services/NotificationService';
import { EventBus } from '../../../../../src/infrastructure/events/EventBus';

describe('CreateLabHandler', () => {
  let mockRepo: jest.Mocked<ILabRepository>;
  let mockNotify: jest.Mocked<INotificationService>;
  let mockEventBus: jest.Mocked<EventBus>;
  let handler: CreateLabHandler;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn<any>().mockResolvedValue(10),
      delete: jest.fn<any>(),
      update: jest.fn<any>(),
      updateStatus: jest.fn<any>()
    };
    
    mockNotify = {
      send: jest.fn<any>()
    };
    
    mockEventBus = {
      publish: jest.fn<any>(),
      subscribe: jest.fn<any>()
    } as any;

    handler = new CreateLabHandler(mockRepo, mockNotify, mockEventBus);
  });

  it('should call notification service in sync mode', async () => {
    const command = new CreateLabCommand('Lab 1', new Date(), 1, 5);
    await handler.execute(command, 'sync');

    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockNotify.send).toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it('should publish event in async mode', async () => {
    const command = new CreateLabCommand('Lab 2', new Date(), 1, 5);
    await handler.execute(command, 'async');

    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalledWith('LabWorkCreated', expect.any(Object));
    expect(mockNotify.send).not.toHaveBeenCalled();
  });

  it('should not fail if sync notification fails', async () => {
    mockNotify.send.mockImplementation(() => {
      throw new Error('Notification service down');
    });

    const command = new CreateLabCommand('Lab 3', new Date(), 1, 5);
    const result = await handler.execute(command, 'sync');

    expect(result).toBe(10);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
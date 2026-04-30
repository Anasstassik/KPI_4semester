import { Lab } from '../Lab';
import { LabStatus } from '../value-objects/LabStatus';
import { DomainError } from '../errors';

export class LabFactory {
  static createNew(title: string, deadlineStr: string, disciplineId: number, studentId: number): Lab {
    const deadline = new Date(deadlineStr);
    if (isNaN(deadline.getTime())) throw new DomainError('Некоректна дата дедлайну');
    if (deadline < new Date()) throw new DomainError('Дедлайн не може бути в минулому');

    return new Lab({
      title,
      deadline,
      disciplineId,
      studentId,
      status: new LabStatus('До виконання')
    });
  }
}
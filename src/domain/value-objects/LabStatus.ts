import { DomainError } from '../errors';

export type StatusValue = 'До виконання' | 'На перевірці' | 'Здано';

export class LabStatus {
  public readonly value: StatusValue;
  constructor(value: string) {
    const validStatuses: StatusValue[] = ['До виконання', 'На перевірці', 'Здано'];
    if (!validStatuses.includes(value as StatusValue)) {
      throw new DomainError(`Некоректний статус: ${value}`);
    }
    this.value = value as StatusValue;
  }
}
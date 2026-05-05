import { describe, it, expect} from '@jest/globals';
import { LabWork } from '../../../src/domain/LabWork';
import { DomainError } from '../../../src/domain/errors';

describe('LabWork Domain', () => {
  it('should create lab work successfully', () => {
    const lab = new LabWork({
      title: 'Docker Setup',
      deadline: new Date(),
      status: 'TODO',
      disciplineId: 1,
      studentId: 5
    });
    
    expect(lab.title).toBe('Docker Setup');
    expect(lab.studentId).toBe(5);
    expect(lab.disciplineId).toBe(1);
  });

  it('should throw error if title is empty', () => {
    expect(() => {
      new LabWork({
        title: '',
        deadline: new Date(),
        status: 'TODO',
        disciplineId: 1,
        studentId: 1
      });
    }).toThrow(DomainError);
    
    expect(() => {
      new LabWork({
        title: '   ',
        deadline: new Date(),
        status: 'TODO',
        disciplineId: 1,
        studentId: 1
      });
    }).toThrow("Назва лабораторної обов'язкова");
  });
});
const Discipline = require('../../../src/domain/Discipline');
const { DomainError } = require('../../../src/domain/errors');

describe('Discipline Domain', () => {
  it('повинен створювати дисципліну з назвою', () => {
    const discipline = Discipline.create({ name: 'Математика' });
    expect(discipline.name).toBe('Математика');
  });

  it('повинен кидати помилку при відсутності назви', () => {
    expect(() => {
      Discipline.create({ name: '' });
    }).toThrow(DomainError);
    expect(() => {
      Discipline.create({ name: '' });
    }).toThrow("Назва обов'язкова");
  });
});

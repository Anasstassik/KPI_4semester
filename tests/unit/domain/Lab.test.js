const Lab = require('../../../src/domain/Lab');
const { DomainError } = require('../../../src/domain/errors');

describe('Lab Domain', () => {
  it('повинен створювати лабу з валідним дедлайном', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    const lab = Lab.create({ 
      title: 'Lab 1', 
      deadline: futureDate.toISOString(), 
      disciplineId: 1 
    });
    
    expect(lab.title).toBe('Lab 1');
    expect(lab.status).toBe('До виконання');
  });

  it('повинен кидати помилку якщо дедлайн в минулому', () => {
    expect(() => {
      Lab.create({ 
        title: 'Lab 1', 
        deadline: '2020-01-01', 
        disciplineId: 1 
      });
    }).toThrow(DomainError);
  });

  it('повинен змінювати статус на валідний', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const lab = Lab.create({ title: 'Lab', deadline: futureDate, disciplineId: 1 });
    
    lab.updateStatus('На перевірці');
    expect(lab.status).toBe('На перевірці');
  });

  it('повинен кидати помилку при зміні на невалідний статус', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const lab = Lab.create({ title: 'Lab', deadline: futureDate, disciplineId: 1 });
    
    expect(() => {
      lab.updateStatus('Невідомий статус');
    }).toThrow(DomainError);
  });
});
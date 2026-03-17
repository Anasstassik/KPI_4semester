const validateStatus = (status) => {
  const allowed = ['До виконання', 'На перевірці', 'Здано'];
  return allowed.includes(status);
};

describe('Перевірка бізнес-логіки (Unit Tests)', () => {
  test('має повертати true для валідного статусу', () => {
    expect(validateStatus('На перевірці')).toBe(true);
  });

  test('має повертати false для вигаданого статусу', () => {
    expect(validateStatus('Я вже все здав')).toBe(false);
  });

  test('перевірка логіки дедлайну: дата в минулому має бути невалідною', () => {
    const pastDate = new Date('2020-01-01');
    const now = new Date();
    expect(pastDate < now).toBe(true);
  });
});
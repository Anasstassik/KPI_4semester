const request = require('supertest');
const { app } = require('../../src/index');
const prisma = require('../../src/infrastructure/database');

describe('Labs Query API (Integration)', () => {
  let token;
  let discId;

  beforeAll(async () => {
    const email = `query_test_${Date.now()}@kpi.ua`;
    await request(app).post('/api/register').send({ email, password: '123', role: 'STUDENT' });
    const res = await request(app).post('/api/login').send({ email, password: '123' });
    token = res.body.token;

    const disc = await prisma.discipline.create({ data: { name: `Query Disc ${Date.now()}` } });
    discId = disc.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('має повертати список лабораторних робіт', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    await prisma.labWork.create({
      data: { 
        title: 'Lab 1', 
        deadline: futureDate, 
        disciplineId: discId, 
        status: 'До виконання' 
      }
    });

    const res = await request(app)
      .get('/api/labs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const foundLab = res.body.find(l => l.title === 'Lab 1');
    expect(foundLab).toBeDefined();
    expect(foundLab).toHaveProperty('title', 'Lab 1');
  });
});
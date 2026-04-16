const request = require('supertest');
const { app } = require('../../src/index');
const prisma = require('../../src/infrastructure/database');

describe('Disciplines Query API (Integration)', () => {
  let token;

  beforeAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();
    
    await request(app).post('/api/register').send({ email: 'teach@kpi.ua', password: '123', role: 'TEACHER' });
    const res = await request(app).post('/api/login').send({ email: 'teach@kpi.ua', password: '123' });
    token = res.body.token;

    await prisma.discipline.create({ data: { name: 'Алгебра' } });
    await prisma.discipline.create({ data: { name: 'Геометрія' } });
  });

  afterAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();
  });

  it('має повертати список дисциплін', async () => {
    const res = await request(app)
      .get('/api/disciplines')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});

const request = require('supertest');
const { app } = require('../src/index.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Disciplines API', () => {
  let teacherToken;

  beforeAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();

    await request(app)
      .post('/api/register')
      .send({ email: 'teacher@kpi.ua', password: 'password123', role: 'TEACHER' });

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'teacher@kpi.ua', password: 'password123' });

    teacherToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('повинен створити нову дисципліну і повернути 201', async () => {
    const res = await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Математичний аналіз' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('disciplineId');
  });

  it('повинен повернути 409 для дубльованих назв дисциплін', async () => {
    await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Хімія' });

    const res = await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Хімія' });
    
    expect(res.statusCode).toEqual(409);
  });

  it('повинен повернути 401 для неавторизованого запиту', async () => {
    const res = await request(app)
      .post('/api/disciplines')
      .send({ name: 'Фізика' });
    
    expect(res.statusCode).toEqual(401);
  });
});

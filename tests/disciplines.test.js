const request = require('supertest');
const { app } = require('../src/index.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Disciplines API', () => {
  let teacherToken;

  beforeAll(async () => {
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
  });

  it('повинен повернути 409 для дубльованих назв дисциплін', async () => {
    const res = await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Математичний аналіз' });
    
    expect(res.statusCode).toEqual(409);
  });
});

const request = require('supertest');
const { app } = require('../src/index.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Labs API & RBAC', () => {
  let teacherToken, studentToken, disciplineId;

  beforeAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/api/register').send({ email: 't@kpi.ua', password: '123', role: 'TEACHER' });
    const tLogin = await request(app).post('/api/login').send({ email: 't@kpi.ua', password: '123' });
    teacherToken = tLogin.body.token;

    await request(app).post('/api/register').send({ email: 's@kpi.ua', password: '123', role: 'STUDENT' });
    const sLogin = await request(app).post('/api/login').send({ email: 's@kpi.ua', password: '123' });
    studentToken = sLogin.body.token;


    const disc = await prisma.discipline.create({ data: { name: 'Тестова дисципліна' } });
    disciplineId = disc.id;
  });

  test('Студент НЕ може створювати лаби (403)', async () => {
    const res = await request(app)
      .post('/api/labs')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'Lab 1', deadline: '2030-01-01', disciplineId });
    
    expect(res.statusCode).toEqual(403);
  });

  test('Неавторизований користувач отримує 401', async () => {
    const res = await request(app).get('/api/labs');
    expect(res.statusCode).toEqual(401);
  });

  test('Вчитель може створити лабу з валідним дедлайном', async () => {
    const res = await request(app)
      .post('/api/labs')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ 
        title: 'Valid Lab', 
        deadline: '2030-12-31', 
        disciplineId 
      });
    expect(res.statusCode).toEqual(201);
  });

  test('Помилка 400 при дедлайні в минулому', async () => {
    const res = await request(app)
      .post('/api/labs')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ 
        title: 'Past Lab', 
        deadline: '2020-01-01', 
        disciplineId 
      });
    expect(res.statusCode).toEqual(400);
  });
});
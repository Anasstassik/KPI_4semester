const request = require('supertest');
const { app } = require('../src/index');
const prisma = require('../src/infrastructure/database');

describe('Labs API & RBAC', () => {
  let teacherToken;
  let studentToken;
  let disciplineId;

  beforeAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/api/register').send({ email: 'teacher_lab@kpi.ua', password: '123', role: 'TEACHER' });
    const resT = await request(app).post('/api/login').send({ email: 'teacher_lab@kpi.ua', password: '123' });
    teacherToken = resT.body.token;

    await request(app).post('/api/register').send({ email: 'student_lab@kpi.ua', password: '123', role: 'STUDENT' });
    const resS = await request(app).post('/api/login').send({ email: 'student_lab@kpi.ua', password: '123' });
    studentToken = resS.body.token;

    const discRes = await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Програмування' });
    disciplineId = discRes.body.disciplineId;
  });

  afterAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();
  });

  it('Студент НЕ може створювати лаби (403)', async () => {
    const res = await request(app)
      .post('/api/labs')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'Lab 1', deadline: '2030-01-01', disciplineId });
    
    expect(res.statusCode).toEqual(403);
  });

  it('Неавторизований користувач отримує 401', async () => {
    const res = await request(app).get('/api/labs');
    
    expect(res.statusCode).toEqual(401);
  });

  it('Вчитель може створити лабу з валідним дедлайном', async () => {
    const res = await request(app)
      .post('/api/labs')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Lab 2', deadline: '2030-01-01', disciplineId });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('labId');
  });

  it('Помилка 400 при дедлайні в минулому', async () => {
    const res = await request(app)
      .post('/api/labs')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Lab 3', deadline: '2000-01-01', disciplineId });
    
    expect(res.statusCode).toEqual(400);
  });
});
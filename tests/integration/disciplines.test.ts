import request from 'supertest';
import { app } from '../../src/index';
import prisma from '../../src/infrastructure/database';

describe('Disciplines API', () => {
  let teacherToken: string;

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
    expect(res.body).toHaveProperty('id');
  });

  it('повинен повернути 400 для дубльованих назв дисциплін', async () => {
    await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Хімія' });

    const res = await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Хімія' });
    
    expect(res.statusCode).toEqual(400);
  });

  it('повинен повернути 401 для неавторизованого запиту', async () => {
    const res = await request(app)
      .post('/api/disciplines')
      .send({ name: 'Фізика' });
    
    expect(res.statusCode).toEqual(401);
  });
});

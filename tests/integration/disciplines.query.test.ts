import { describe, beforeAll, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/index';
import prisma from '../../src/infrastructure/database';

describe('Disciplines Query API (Integration)', () => {
  let token: string;

  beforeAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();

    const regRes = await request(app)
      .post('/api/register')
      .send({ email: 'query_tester@kpi.ua', password: 'password123', role: 'TEACHER' });

    if (regRes.statusCode !== 200 && regRes.statusCode !== 201) {
      throw new Error(`Register error: ${JSON.stringify(regRes.body)}`);
    }

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'query_tester@kpi.ua', password: 'password123' });

    if (loginRes.statusCode !== 200) {
      throw new Error(`Login error: ${JSON.stringify(loginRes.body)}`);
    }

    token = loginRes.body.token;

    await prisma.discipline.create({ data: { name: 'Math' } });
    await prisma.discipline.create({ data: { name: 'Physics' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
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

  it('повинен повернути 401 для неавторизованого запиту', async () => {
    const res = await request(app).get('/api/disciplines');
    expect(res.statusCode).toEqual(401);
  });
});
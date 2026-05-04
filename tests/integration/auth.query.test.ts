import request from 'supertest';
import { app } from '../../src/index';
import prisma from '../../src/infrastructure/database';

describe('Auth Query API (Integration)', () => {
  const testUser = {
    email: 'querytest@kpi.ua',
    password: 'password123',
    role: 'STUDENT'
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await request(app).post('/api/register').send(testUser);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  it('має повертати токен для валідних даних', async () => {
    const res = await request(app).post('/api/login').send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('має повертати 401 для невалідних даних', async () => {
    const res = await request(app).post('/api/login').send({
      email: testUser.email,
      password: 'wrongpassword'
    });
    expect(res.statusCode).toEqual(401);
  });
});
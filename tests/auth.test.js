const request = require('supertest');
const { app } = require('../src/index.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Автентифікація API', () => {
  const testUser = {
    email: 'test@student.com',
    password: 'password123',
    role: 'STUDENT'
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  it('повинно реєструвати нового користувача', async () => {
    const res = await request(app).post('/api/register').send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('повинно логінити і видавати JWT токен', async () => {
    const res = await request(app).post('/api/login').send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
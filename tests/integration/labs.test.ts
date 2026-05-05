import { describe, beforeAll, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/index';
import prisma from '../../src/infrastructure/database';

describe('Labs API (Integration)', () => {
  let teacherToken: string;
  let disciplineId: number;
  let validUserId: number;

  beforeAll(async () => {
    await prisma.labWork.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();

    await request(app)
      .post('/api/register')
      .send({ email: 'teacher_labs@kpi.ua', password: 'password123', role: 'TEACHER' });

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'teacher_labs@kpi.ua', password: 'password123' });

    teacherToken = loginRes.body.token;

    const user = await prisma.user.findFirst({
      where: { email: 'teacher_labs@kpi.ua' }
    });
    validUserId = user!.id;

    const disciplineRes = await request(app)
      .post('/api/disciplines')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Architecture and Design' });

    disciplineId = disciplineRes.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/labs (sync mode) should create lab', async () => {
    const res = await request(app)
      .post('/api/labs')
      .query({ mode: 'sync' })
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        title: 'CQRS Implementation',
        deadline: new Date().toISOString(),
        disciplineId: disciplineId,
        studentId: validUserId 
      });

    if (res.statusCode !== 201) {
      console.error('SERVER ERROR:', res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body.communication).toBe('sync');
    expect(res.body).toHaveProperty('id');
  });

  it('POST /api/labs (async mode) should create lab', async () => {
    const res = await request(app)
      .post('/api/labs')
      .query({ mode: 'async' })
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        title: 'Event Sourcing',
        deadline: new Date().toISOString(),
        disciplineId: disciplineId,
        studentId: validUserId 
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.communication).toBe('async');
  });

  it('POST /api/labs should return 401 if unauthorized', async () => {
    const res = await request(app)
      .post('/api/labs')
      .send({
        title: 'Unauthorized Lab',
        deadline: new Date().toISOString(),
        disciplineId: disciplineId,
        studentId: validUserId
      });

    expect(res.statusCode).toBe(401);
  });
});
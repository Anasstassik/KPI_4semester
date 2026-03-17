const request = require('supertest');
const { app } = require('../src/index.js');

describe('Disciplines API', () => {
  let teacherToken;

  beforeAll(async () => {
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

const request = require('supertest');
const app = require('../src'); 
const db = require('../src/db');
const { redisClient } = require('../src/utils/redis');

describe('Donation Routes', () => {
  let authCookie;
  let createdRequestId;

  const credentials = {
    email: 'john@example.com', // from seed user
    password: 'password',
  };

  const testDonationRequest = {
    bloodType: 'A+',
    quantity: 1,
    location: [77.594562, 12.971598], // [lon, lat]
    message: 'Need urgent help',
  };

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send(credentials);
    authCookie = loginResponse.headers['set-cookie'];
  });

  afterAll(async () => {
    try {
      await redisClient.quit();
    } catch (e) {
      // ignore
    }
    try {
      await db.close();
    } catch (e) {
      // ignore
    }
    try {
      if (app.server && app.server.close) {
        await new Promise((resolve) => app.server.close(resolve));
      }
    } catch (e) {
      // ignore
    }
  });

  it('should create a new donation request', async () => {
    const response = await request(app)
      .post('/api/donationRequest')
      .set('Cookie', authCookie)
      .send(testDonationRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    createdRequestId = response.body.donationRequest.id;
  });

  it('should get donation requests', async () => {
    const response = await request(app)
      .get('/api/donationRequest')
      .set('Cookie', authCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should update a donation request', async () => {
    const response = await request(app)
      .put(`/api/donationRequest/${createdRequestId}`)
      .set('Cookie', authCookie)
      .send({
        quantity: 2,
        bloodType: 'B+',
        location: [77.594562, 12.971598], // [lon, lat]
        isFulfilled: true,
        message: 'Updated',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should reject invalid donation request payload with 400', async () => {
    const response = await request(app)
      .post('/api/donationRequest')
      .set('Cookie', authCookie)
      .send({
        bloodType: 'INVALID',
        quantity: -1,
        location: ['x', 'y'],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should return 401 when creating donation request without auth cookie', async () => {
    const res = await request(app)
      .post('/api/donationRequest')
      .send({ bloodType: 'A+', quantity: 1, location: [0, 0] });
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 when listing donation requests without auth cookie', async () => {
    const res = await request(app).get('/api/donationRequest');
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 when updating donation request without auth cookie', async () => {
    const res = await request(app)
      .put('/api/donationRequest/1')
      .send({ quantity: 2 });
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 when deleting donation request without auth cookie', async () => {
    const res = await request(app).delete('/api/donationRequest/1');
    expect(res.statusCode).toBe(401);
  });

  it('should delete a donation request', async () => {
    const createRes = await request(app)
      .post('/api/donationRequest')
      .set('Cookie', authCookie)
      .send(testDonationRequest);

    const id = createRes.body.donationRequest.id;

    const deleteRes = await request(app)
      .delete(`/api/donationRequest/${id}`)
      .set('Cookie', authCookie);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});

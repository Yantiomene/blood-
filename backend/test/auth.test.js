const request = require('supertest');
const app = require('../src');
const db = require('../src/db');
const { redisClient } = require('../src/utils/redis');

describe('Authentication Routes', () => {
  const uniqueEmail = `test+${Date.now()}@example.com`;
  const uniqueUsername = `testuser_${Date.now()}`;
  const testUser = {
    username: uniqueUsername,
    email: uniqueEmail,
    password: 'testpassword',
    bloodType: 'A+',
  };

  afterAll(async () => {
    try {
      await redisClient.quit();
      await db.close();
      if (app.server && app.server.close) {
        await new Promise((resolve) => app.server.close(resolve));
      }
    } catch (e) {
      // ignore
    }
  }, 10000);

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBeDefined();
  });
  

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should return user profile information', async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
  
    // Extract the cookie from the login response
    const cookies = loginResponse.headers['set-cookie'];
  
    const profileResponse = await request(app)
      .get('/api/profile')
      .set('Cookie', cookies); // Set the auth cookie
  
    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body.success).toBe(true);
    expect(profileResponse.body.user).toBeDefined();
  });
  
  it('should reject invalid login with 400', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'notfound@example.com', password: 'wrongpass' });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should logout and clear auth cookie', async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookies = loginResponse.headers['set-cookie'];

    const logoutResponse = await request(app)
      .get('/api/logout')
      .set('Cookie', cookies);

    expect(logoutResponse.statusCode).toBe(200);
    expect(logoutResponse.body.success).toBe(true);
  });
});

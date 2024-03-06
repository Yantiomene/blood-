const request = require('supertest');
const app = require('../src');
const { redisClient } = require('../src/utils/redis');

describe('Authentication Routes', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword',
    bloodType: 'A+',
  };

  // Remove the beforeAll hook for starting the server

  // Add an afterAll hook to close the server after tests
  afterAll(async (done) => {
    // Close the Redis client
    await redisClient.quit();
  
    // Close the Express server
    app.server.close(() => {
      // Ensure the server is closed before calling done
      done();
    });
  }, 10000); // Increase the timeout to 10 seconds  

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(testUser);
  
    // Update the expected status code to 400 (Bad Request)
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.error).toBeDefined();
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
      .set('token', cookies) // Set the cookie in the request headers
  
    // Update the expected status code to 200 (OK)
    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body.success).toBe(true);
    expect(profileResponse.body.data).toBeDefined();
  });
  
});

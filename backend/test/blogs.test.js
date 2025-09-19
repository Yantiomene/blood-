const request = require('supertest');
const app = require('../src');
const db = require('../src/db');
const { redisClient } = require('../src/utils/redis');

describe('Blogs Routes', () => {
  let authCookie;
  let createdBlogId;

  const credentials = {
    email: 'john@example.com', // from seed user
    password: 'password',
  };

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send(credentials);
    authCookie = loginResponse.headers['set-cookie'];
  });

  afterAll(async () => {
    try { await redisClient.quit(); } catch(_) {}
    try { await db.close(); } catch(_) {}
    try {
      if (app.server && app.server.close) {
        await new Promise((resolve) => app.server.close(resolve));
      }
    } catch(_) {}
  });

  it('should list blogs (public)', async () => {
    const res = await request(app)
      .get('/blogs/getBlogs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.blogs)).toBe(true);
  });

  it('should create a blog', async () => {
    const res = await request(app)
      .post('/blogs/create')
      .set('Cookie', authCookie)
      .send({ title: 'Test Blog', content: 'Hello world' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.blog).toBeDefined();
    createdBlogId = res.body.blog.id;
  });

  it('should get blog by id', async () => {
    const res = await request(app)
      .get(`/blogs/getBlog/${createdBlogId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blog.id).toBe(createdBlogId);
  });

  it('should update a blog', async () => {
    const res = await request(app)
      .put(`/blogs/updateBlog/${createdBlogId}`)
      .set('Cookie', authCookie)
      .send({ content: 'Updated content' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blog.content).toBe('Updated content');
  });

  it('should delete a blog', async () => {
    const res = await request(app)
      .delete(`/blogs/deleteBlog/${createdBlogId}`)
      .set('Cookie', authCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
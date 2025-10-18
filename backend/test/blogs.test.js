const request = require('supertest');
const app = require('../src');
const db = require('../src/db');
const { redisClient } = require('../src/utils/redis');

describe('Blogs Routes', () => {
  let authCookie;
  let createdBlogId;

  // Create a dynamic user for auth (avoid seed dependency)
  const makeUnique = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const testEmail = `${makeUnique('blog_user')}@example.com`;
  const testUsername = makeUnique('blog_username');
  const testPassword = 'password';

  beforeAll(async () => {
    // Register user
    await request(app)
      .post('/api/register')
      .send({ username: testUsername, email: testEmail, password: testPassword, bloodType: 'A+' });

    // Login and capture cookie
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ email: testEmail, password: testPassword });
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

  it('should generate blog content via AI (admin only, falls back if no key)', async () => {
    const res = await request(app)
      .post(`/blogs/${createdBlogId}/generate`)
      .set('Cookie', authCookie)
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blog).toBeDefined();
    expect(typeof res.body.blog.content).toBe('string');
    expect(res.body.blog.content.length).toBeGreaterThan(20);
    // provider present: 'deepseek' or 'local_fallback'
    expect(['deepseek', 'local_fallback']).toContain(res.body.provider);
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
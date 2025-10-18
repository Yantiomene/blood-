const request = require('supertest');
const app = require('../src');
const db = require('../src/db');
const { redisClient } = require('../src/utils/redis');

describe('Donation Acceptances & Conversations', () => {
  let donorCookie;
  let requestorCookie;
  let donorId;
  let requestorId;
  let requestId;
  let conversationId;

  // remove seeded user usage; generate unique users for tests
  const makeUnique = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  beforeAll(async () => {
    // Register donor and mark verified
    const donorEmail = `${makeUnique('donor')}@example.com`;
    const donorUsername = makeUnique('donor_user');
    await request(app)
      .post('/api/register')
      .send({ username: donorUsername, email: donorEmail, password: 'donorpassword', bloodType: 'A+' });
    await db.query('UPDATE users SET "isVerified" = $1 WHERE email = $2', [true, donorEmail]);
    const donorLogin = await request(app)
      .post('/api/login')
      .send({ email: donorEmail, password: 'donorpassword' });
    donorCookie = donorLogin.headers['set-cookie'];
    const donorUserRes = await db.query('SELECT id FROM users WHERE email = $1', [donorEmail]);
    donorId = donorUserRes.rows[0].id;

    // Register a new requestor and mark verified
    const requestorEmail = `${makeUnique('requestor')}@example.com`;
    const requestorUsername = makeUnique('requestor_user');

    await request(app)
      .post('/api/register')
      .send({ username: requestorUsername, email: requestorEmail, password: 'reqpassword', bloodType: 'O+' });

    await db.query('UPDATE users SET "isVerified" = $1 WHERE email = $2', [true, requestorEmail]);

    // Login as requestor
    const requestorLogin = await request(app)
      .post('/api/login')
      .send({ email: requestorEmail, password: 'reqpassword' });
    requestorCookie = requestorLogin.headers['set-cookie'];

    const reqUserRes = await db.query('SELECT id FROM users WHERE email = $1', [requestorEmail]);
    requestorId = reqUserRes.rows[0].id;

    // Create donation request by requestor
    const createRes = await request(app)
      .post('/api/donationRequest')
      .set('Cookie', requestorCookie)
      .send({ bloodType: 'O+', quantity: 500, location: [7.111, 9.222], message: 'Need help near station, contact 555-555-0000' });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.donationRequest).toBeDefined();
    requestId = createRes.body.donationRequest.id;
  });

  afterAll(async () => {
    try { await redisClient.quit(); } catch (_) {}
    try { await db.close(); } catch (_) {}
    try {
      if (app.server && app.server.close) {
        await new Promise((resolve) => app.server.close(resolve));
      }
    } catch (_) {}
  });

  it('creates conversation on acceptance and returns conversationId', async () => {
    const acceptRes = await request(app)
      .post(`/api/acceptRequest/${requestId}`)
      .set('Cookie', donorCookie);

    expect(acceptRes.statusCode).toBe(200);
    expect(acceptRes.body.success).toBe(true);
    expect(acceptRes.body.conversationId).toBeDefined();

    conversationId = acceptRes.body.conversationId;

    // Verify conversation canonical participant order via conversations endpoint
    const convListRes = await request(app)
      .get(`/api/conversations/${donorId}`)
      .set('Cookie', donorCookie);
    expect([200, 404]).toContain(convListRes.statusCode); // allow no conversations edge
    if (convListRes.statusCode === 200) {
      const conv = convListRes.body.conversations.find((c) => c.id === conversationId);
      expect(conv).toBeDefined();
      const p1 = Math.min(donorId, requestorId);
      const p2 = Math.max(donorId, requestorId);
      expect(conv.senderId).toBe(p1);
      expect(conv.receiverId).toBe(p2);
    }
  });

  it('prevents duplicate acceptance with 409', async () => {
    const secondRes = await request(app)
      .post(`/api/acceptRequest/${requestId}`)
      .set('Cookie', donorCookie);

    expect(secondRes.statusCode).toBe(409);
    expect(secondRes.body.success).toBe(false);
  });

  it('lists acceptances with donor info and conversation id for owner', async () => {
    const listRes = await request(app)
      .get(`/api/donationRequest/${requestId}/acceptances`)
      .set('Cookie', requestorCookie);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(Array.isArray(listRes.body.acceptances)).toBe(true);

+    console.log('ACCEPTANCES:', listRes.body.acceptances);
    const acc = listRes.body.acceptances.find((a) => a.donorId === donorId);
    expect(acc).toBeDefined();
    expect(acc.conversationId).toBe(conversationId);
  });

  it('forbids non-owner from viewing acceptances', async () => {
    const forbidRes = await request(app)
      .get(`/api/donationRequest/${requestId}/acceptances`)
      .set('Cookie', donorCookie);
    expect(forbidRes.statusCode).toBe(403);
  });

  it('returns 404 for non-existent request acceptances', async () => {
    const missingRes = await request(app)
      .get('/api/donationRequest/999999/acceptances')
      .set('Cookie', requestorCookie);
    expect(missingRes.statusCode).toBe(404);
  });
});
const request = require('supertest');
const app = require('../src'); 

describe('Donation Routes', () => {
  
  const testDonationRequest = {
    bloodType: 'A+',
    quantity: 1,
    location: [12.971598, 77.594562], // Example: Bangalore, India
    isFulfilled: false,
    requestingEntity: 'User',
    requestingEntityId: 1, // Replace with a valid user ID
  };

  it('should create a new donation request', async () => {
    const response = await request(app)
      .post('/api/donationRequest')
      .send(testDonationRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);

  });

  it('should get donation requests', async () => {
    const response = await request(app).get('/api/donationRequests');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    
  });

  it('should update a donation request', async () => {
    const donationRequestId = 1;

    const response = await request(app)
      .put(`/api/donationRequest/${donationRequestId}`)
      .send({
        quantity: 2,
        bloodType: 'B+',
        location: [12.971598, 77.594562], // Updated location
        isFulfilled: true,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

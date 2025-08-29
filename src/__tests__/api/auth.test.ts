import request from 'supertest';
import app from '../../app';

// Mock the Auth Service to avoid real DB calls
jest.mock('../../api/services/auth.service', () => ({
  login: jest.fn((username: string, password: string) => {
    if (username === 'testuser' && password === 'testpass') {
      return { token: 'fake-jwt-token' }; // Mock token
    }
    // Simulate failed login
    const error: any = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }),
}));

describe('Auth API', () => {
  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token', 'fake-jwt-token');
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});

// server/test/userController.test.js

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import User from '../models/User';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Controller', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      });

    token = res.body.token;
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should update a user', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated User');
  });

  it('should delete a user', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const res = await request(app)
      .delete(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });
});
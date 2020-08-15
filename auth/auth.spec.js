const request = require('supertest');
const server = require('../api/server.js');

describe('server.js', () => {
  it('that the testing environment is set up', () => {
    expect(process.env.DB_ENV).toBe('testing');
  })
})

const http = require('http') ;
const request = require('supertest');
const app = require('../../src/app');


describe('Routes', () => {
  let server, agent;

  beforeAll(done => {
    server = http.createServer(app);
    server.listen(() => {
      agent = request.agent(server);
      done();
    });
    // server = require('../../src/app');
    // agent = request.agent(server);
  });
  afterAll(done => {
    server.close(done);
  });

  it('should respond with 200 if open home page', async () => {
    const res = await agent.get('/');

    expect(res.status).toBe(200);
  });

  it('should respond with 404 if open invalid routes', async () => {
    const res = await agent.get('/xxx');

    expect(res.status).toBe(404);
  });

});
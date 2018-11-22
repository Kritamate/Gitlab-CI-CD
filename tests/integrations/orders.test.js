const http = require('http') ;
const request = require('supertest');
const app = require('../../src/app');

describe('API /orders', () => {

  let server, agent;

  beforeAll(done => {
    server = http.createServer(app);
    server.listen(() => {
      agent = request.agent(server);
      done();
    });
  });
  afterAll(done => {
    server.close(done);
  });


  describe('GET /orders/discount', () => {

    it('should respond with 404 if no cusId', async () => {
      const res = await agent.get('/orders/discount')
        .set('Accept', 'application/json');

      expect(res.status).toBe(404);
    });

    it('should respond with 404 if no totalPrice ', async () => {
      const res = await agent.get('/orders/discount?cusId=1')
        .set('Accept', 'application/json');

      expect(res.status).toBe(404);
    });

    it('should respond with json', async () => {
      const res = await agent.get('/orders/discount?cusId=1&totalPrice=10')
        .set('Accept', 'application/json');

      expect(res.header['content-type']).toMatch(/json/);
      expect(res.status).toBe(200);
    });

  });

});
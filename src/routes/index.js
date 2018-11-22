const orders = require('./orders');

const setupRoutes = app => {  
  app.use('/orders', orders);

  // home page
  app.get('/', (req, res) => {
    res.send(`
    <h1>Demo CI/CD</h1>
    <a href="/orders/discount?cusId=1&totalPrice=10">try this</a>
    `);
  });

  // handle 404
  app.use((req, res) => {
    res.status(404).json({
      error: {
        status: 404,
        message: 'Invalid route.'
      }
    });
  })
}

module.exports.setupRoutes = setupRoutes;
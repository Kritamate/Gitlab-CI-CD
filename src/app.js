const express = require('express');
const routes = require('./routes');

const app = express();

routes.setupRoutes(app);

// const server = app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });

module.exports = app;

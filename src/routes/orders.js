const express = require('express');
const lib = require('../lib');

const router = express.Router();

router.get('/discount', async (req, res) => {
  const { cusId, totalPrice } = req.query;

  if (!cusId) {
    return res.status(404).json({ error: { message: 'Customer ID (cusId) is required!' } });
  }

  if (!totalPrice) {
    return res.status(404).json({ error: { message: 'Total price (totalPrice) is required!' } });
  }

  const order = { 
    customerId: cusId,
    totalPrice: +totalPrice // convert string to int
  };

  await lib.applyDiscount(order);  
  res.json(order);
});

module.exports = router;
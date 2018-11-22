const db = require('./db');

module.exports.applyDiscount = async (order) => {
  const { customerId } = order;
  const customer = await db.getCustomerById(customerId);
  
  if (customer.points > 10) {
    // discount 10%
    order.totalPrice *= 0.9;
  }
}
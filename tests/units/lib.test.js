const db = require('../../src/db');
const lib = require('../../src/lib');

describe('apply discount', () => {
  it('should apply 10% discount if customer has more than 10 points', async () => {
    // mock functions
    db.getCustomerById = jest.fn();
    db.getCustomerById.mockResolvedValue({
      id: 1,
      points: 11
    });

    const order = {
      customerId: 1,
      totalPrice: 10
    }

    await lib.applyDiscount(order);
    
    expect(order.totalPrice).toBe(9);
  });

  it('should return same totalPrice if customer has less than 10 points', async () => {
    // mock functions
    db.getCustomerById = jest.fn();
    db.getCustomerById.mockResolvedValue({
      id: 1,
      points: 9
    });

    const order = {
      customerId: 1,
      totalPrice: 10
    }

    await lib.applyDiscount(order);
    
    expect(order.totalPrice).toBe(10);
  });
});
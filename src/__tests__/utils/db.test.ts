import { products, orders } from '../../utils/db';

describe('Database Mock', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  test('Adds a product to the database', () => {
    const product = { id: '1', name: 'Test Product', price: 100 , description:"test description 1",stock:30};
    products.push(product);

    expect(products).toHaveLength(1);
    expect(products[0]).toEqual(product);
  });

  test('Adds an order to the database', () => {
    const order = { id: '1', customerName: 'John Doe', products: [], totalPrice: 0 };
    orders.push(order);

    expect(orders).toHaveLength(1);
    expect(orders[0]).toEqual(order);
  });
});

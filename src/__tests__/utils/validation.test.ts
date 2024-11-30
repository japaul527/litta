import { productSchema, orderSchema } from '../../utils/validation';

describe('Validation', () => {
  test('Validates product schema', () => {
    const product = {
      "name": "Laptop",
      "price": 1000,
      "description": "A high-performance laptop",
      "stock": 10
    };
    expect(() => productSchema.parse(product)).not.toThrow();
  });

  test('Invalid product schema throws error', () => {
    const product = { name: 'Test Product' }; // Missing price
    expect(() => productSchema.parse(product)).toThrow();
  });

  test('Validates order schema', () => {
    const order = { customerName: 'John Doe', products: [{ productId: '1', quantity: 2 }] };
    expect(() => orderSchema.parse(order)).not.toThrow();
  });
});

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
  }
  
  export interface Order {
    id: string;
    products: { productId: string; quantity: number }[];
    totalPrice: number;
  }
  
  export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
  }
  
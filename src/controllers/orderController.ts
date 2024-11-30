import { Request, Response } from "express";
import { orders, products } from "../utils/db";
import { orderSchema } from "../utils/validation";
import { Order, Product } from "../models";
import { v4 as uuid } from "uuid";

export const createOrder = (req: Request, res: Response) => {
  try {
    const orderData = orderSchema.parse(req.body);
    let totalPrice = 0;
    orderData.products.forEach(({ productId, quantity }) => {
      

      const product  = products.find((p) =>
        {
          return p.id === productId
        }
          );
      if (!product) throw new Error(`Product with id ${productId} not found`);
      totalPrice += product.price * quantity;
    });

    const newOrder: Order = { id:uuid(),...orderData, totalPrice };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (err :any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

export const getAllOrders = (_req: Request, res: Response) => {
  res.json(orders);
};

export const getOrderById = (req: Request, res: Response) : any| undefined => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
};

export const updateOrder = (req: Request, res: Response) : any | undefined=> {
  const orderIndex = orders.findIndex((o) => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  try {
    const updatedOrder = { ...orders[orderIndex], ...req.body };
    orderSchema.parse(updatedOrder);

    let totalPrice = 0;
    updatedOrder.products.forEach(({ productId , quantity } :any) => {
      const product = products.find((p) => p.id === productId);
      if (!product) throw new Error(`Product with id ${productId} not found`);
      totalPrice += product.price * quantity;
    });

    updatedOrder.totalPrice = totalPrice;
    orders[orderIndex] = updatedOrder;
    res.json(updatedOrder);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};
// Partial update an order
export const partialUpdateOrder = (req: Request, res: Response) : any | undefined => {
    const orderIndex = orders.findIndex((o) => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
  
    try {
      const partialUpdate = { ...orders[orderIndex], ...req.body };
  
      let totalPrice = 0;
      partialUpdate.products.forEach(({ productId, quantity }: any) => {
        const product = products.find((p) => p.id === productId);
        if (!product) throw new Error(`Product with id ${productId} not found`);
        totalPrice += product.price * quantity;
      });
  
      partialUpdate.totalPrice = totalPrice;
      orderSchema.parse(partialUpdate); // Validate updated order
      orders[orderIndex] = partialUpdate;
      res.json(partialUpdate);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  };

export const deleteOrder = (req: Request, res: Response) : any|undefined => {
  const orderIndex = orders.findIndex((o) => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders.splice(orderIndex, 1);
  res.json({ message: "Order deleted" });
};

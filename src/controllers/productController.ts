import { Request, Response } from "express";
import { products } from "../utils/db";
import { productSchema } from "../utils/validation";
import { Product } from "../models";
import { v4 as uuid } from "uuid";

export const createProduct = (req: Request, res: Response) => {
    // console.log(req)
  try {
    const productData = productSchema.parse(req.body);
    // console.log("productdata is",productData)
    const newProduct: Product = { id:uuid(), ...productData };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err : any) {
    res.status(400).json({ error: err.errors });
  }
};

export const getAllProducts = (_req: Request, res: Response) => {
    // console.log("products",products)
  res.json(products);
};

export const getProductById  = async (req: Request, res: Response) : Promise< any | undefined>  => {
  const product = products.find((p) => p.id === req.params.id );
  // console.log(product,typeof(product))
  if (!product || product == undefined) {
    return res.status(404).json({ error: "Product not found" });
  }
//   const typedProduct = product as Product;

  res.json(product);
};

export const updateProduct = (req: Request, res: Response) : any | undefined => {
  const productIndex = products.findIndex((p) => p.id === req.params.id );
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  try {
    const updatedProduct = { ...products[productIndex], ...req.body };
    productSchema.parse(updatedProduct);
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (err : any) {
    res.status(400).json({ error: err.errors || "Invalid input " });
  }
};

export const partialUpdateProduct = (req: Request, res: Response) : any | undefined => {
    const productIndex = products.findIndex((p) => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
  
    try {
      const partialUpdate = { ...products[productIndex], ...req.body };
      productSchema.parse(partialUpdate); // Validate updated product
      products[productIndex] = partialUpdate;
      res.json(partialUpdate);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || "Invalid input" });
    }
  };

export const deleteProduct = (req: Request, res: Response) : any | undefined=> {
  const productIndex = products.findIndex((p) => p.id === req.params.id );
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  products.splice(productIndex, 1);
  res.json({ message: "Product deleted" });
};

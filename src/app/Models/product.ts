import { Category } from "./category";

  export interface Product {
    _id: string;
    name: string;
    price: number;
    costPrice: number;
    stock: number;
    category: Category; // Or, optionally, an object if you need to populate category data
    description?: string;
   
  }
  
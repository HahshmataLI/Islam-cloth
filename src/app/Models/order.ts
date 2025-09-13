import { Product } from './product';

export interface Order {
  _id: string;  // Optional because it will be assigned by the database
  user: string;  // User ID
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;  // Optional as it's set on the server
}

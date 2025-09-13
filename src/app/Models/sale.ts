export interface Sale {
  _id: string;  
  customer: {
    _id: string;
    name: string;  // Customer name
  };
  products: Array<{
    product: {
      _id: string;
      name: string;  // Product name
      price:number;
      costPrice:number;
      productId:string;
    };
    quantity: number;
  }>;
  profit: number; 
  totalAmount: number;
  discount: number;       // New: Discount value
  discountType: string;   // New: Discount type ('percentage' or 'amount')
  date: Date;
}

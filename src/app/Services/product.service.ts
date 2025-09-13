import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../Models/product';
import { baseAPIURL } from '../Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${baseAPIURL}products`;

  constructor(private http: HttpClient) {}

//  Fetch all products
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/get-products`);
}

 // Get all products with category information
//  getProducts(): Observable<Product[]> {
//   return this.http.get<Product[]>(this.apiUrl);
// }
  // Fetch products by category ID
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get-products-by-category/${categoryId}`);
  }
// Fetch product by ID
getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/get-product/${id}`);
}

// Add a new product
addProduct(productData: any): Observable<Product> {
  return this.http.post<Product>(`${this.apiUrl}/add-product`, productData);
}

// Update a product by ID
updateProduct(id: string, productData: any): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/update-product/${id}`, productData);
}

// Delete a product by ID
deleteProduct(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/delete-product/${id}`);
}
}
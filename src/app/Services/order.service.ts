import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../Models/order';
import { baseAPIURL } from '../Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${baseAPIURL}`;

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/create-order`, order);
  }

  getOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/get-orders?userId=${userId}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/get-order/${id}`);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/update-order/${id}`, { status });
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-order/${id}`);
  }
}
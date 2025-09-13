import { Injectable } from '@angular/core';
import { Customer } from '../Models/customer';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseAPIURL } from '../Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${baseAPIURL}customers`;

  constructor(private http: HttpClient) {}

  // Get all customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/get-customer`);
  }

  // Add a new customer
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/add-customer`, customer);
  }

  // Update a customer by ID
  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/edit-customer/${id}`, customer);
  }
// Get a customer by ID

getCustomerById(id: string): Observable<Customer> {
  console.log('Fetching customer with ID:', id); // Log the ID
  return this.http.get<Customer>(`${this.apiUrl}/get-customer/${id}`);
}

  // Delete a customer by ID
  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-customer/${id}`);
  }
}
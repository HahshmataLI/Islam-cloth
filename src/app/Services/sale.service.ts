import { Injectable } from '@angular/core';
import { Sale } from '../Models/sale';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseAPIURL } from '../Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  // private apiUrl = 'http://localhost:5000/api/sales';
private apiUrl=`${baseAPIURL}sales`
  constructor(private http: HttpClient) {}
// Get a sale by ID
 // Get a sale by ID with error handling
 getSaleById(id: string): Observable<Sale> {
  return this.http.get<Sale>(`${this.apiUrl}/get-sale/${id}`).pipe(
    catchError(err => {
      console.error('Error fetching sale:', err);
      return throwError(() => new Error('Error fetching sale data'));
    })
  );
}

  // Get all sales
  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/get-sales`);
  }

  // Add a new sale
  addSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/add-sale`, sale);
  }

  // Update a sale by ID
  updateSale(id: string, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/edit-sale/${id}`, sale);
  }

  // Delete a sale by ID
  deleteSale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-sale/${id}`);
  }
}
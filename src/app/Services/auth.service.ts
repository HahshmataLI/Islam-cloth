import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { baseAPIURL } from '../Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private baseUrl = `${baseAPIURL}auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/createuser`, { name, email, password });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  getUserName(): string | null {
    return localStorage.getItem('email');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken(); // Returns true if there is a token, false otherwise
  }
}
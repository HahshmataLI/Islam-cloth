import { Injectable } from '@angular/core';
import { baseAPIURL } from '../Constants/constant';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${baseAPIURL}categories`;

  constructor(private http: HttpClient) {}

  // Add a new category to the API with FormData
  addCategory(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-category`, formData);
  }





getCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.apiUrl}/get-categories`).pipe(
    map((categories: Category[]) => categories.map((category: Category) => {
      // The backend already sends the base64 image string with the correct prefix
      return category;
    }))
  );
}

getCategoryById(id: string): Observable<Category> {
  return this.http.get<Category>(`${this.apiUrl}/get-category/${id}`).pipe(
    map((category: Category) => {
      if (category.imageUrl && typeof category.imageUrl === 'string') {
        category.imageUrl = `data:image/jpeg;base64,${category.imageUrl}`; // Adjust contentType if needed
      }
      return category;
    })
  );
}
  // Update a category by ID with FormData
  updateCategory(id: string, formData: FormData): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update-category/${id}`, formData);
  }
  // Delete a category by ID
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-category/${id}`);
  }
}
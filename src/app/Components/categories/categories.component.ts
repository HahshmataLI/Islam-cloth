import { Component, OnInit } from '@angular/core';
import { Category } from '../../Models/category';
import { CategoryService } from '../../Services/category.service';
import { CardCategoryComponent } from '../card-category/card-category.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CardCategoryComponent,CommonModule,RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        console.log('Fetched Categories:', data); // Check if imageUrl exists
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }
  
  
}
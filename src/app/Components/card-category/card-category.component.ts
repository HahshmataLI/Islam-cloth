import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../Models/category';
import { CategoryService } from '../../Services/category.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-category',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './card-category.component.html',
  styleUrl: './card-category.component.css'
})
export class CardCategoryComponent implements OnInit {
  @Input() category!: Category;
  @Output() categoryDeleted = new EventEmitter<void>();

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    console.log('Category Image URL:', this.category.imageUrl); // Debugging line
    console.log('Received Category:', this.category); // Debugging line
  }

  onAddProduct(): void {
    this.router.navigate(['/add-product', this.category._id]);
  }

  onDeleteCategory(event: Event): void {
    event.stopPropagation(); // Prevent card click event from being triggered
    const categoryId = this.category._id; // Access _id instead of id

    if (!categoryId) {
      console.error('Category ID is undefined');
      return;
    }

    console.log('Category ID:', categoryId); // Debugging line

    if (confirm(`Are you sure you want to delete the category: ${this.category.name}?`)) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.categoryDeleted.emit(); // Notify the parent component to refresh the list
        },
        error: (err) => {
          console.error('Error deleting category:', err);
        }
      });
    }
  }

  onEditCategory(): void {
    this.router.navigate(['/edit-category', this.category._id]); // Navigate to the edit form
  }
}
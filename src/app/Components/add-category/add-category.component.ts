import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../Services/category.service';
import { Category } from '../../Models/category';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnInit {
  addCategoryForm!: FormGroup;
  selectedImageFile: File | null = null;
  categoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: [null]
    });

    this.categoryId = this.route.snapshot.paramMap.get('id');

    if (this.categoryId) {
      this.loadCategoryData();
    }
  }

  loadCategoryData(): void {
    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => {
          this.addCategoryForm.patchValue({
            name: category.name,
            description: category.description
          });
          // Logic to handle existing image can be added here if needed
        },
        error: (err) => {
          console.error('Error loading category data:', err);
        }
      });
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
    }
  }

  onSubmit(): void {
    if (this.addCategoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addCategoryForm.get('name')?.value);
      formData.append('description', this.addCategoryForm.get('description')?.value);
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      if (this.categoryId) {
        this.categoryService.updateCategory(this.categoryId, formData).subscribe({
          next: (response) => {
            console.log('Category updated successfully:', response);
            this.router.navigate(['/categories']);
          },
          error: (err) => {
            console.error('Error updating category:', err);
          }
        });
      } else {
        this.categoryService.addCategory(formData).subscribe({
          next: (response) => {
            console.log('Category added successfully:', response);
            this.router.navigate(['/categories']);
          },
          error: (err) => {
            console.error('Error adding category:', err);
          }
        });
      }
    }
  }
}
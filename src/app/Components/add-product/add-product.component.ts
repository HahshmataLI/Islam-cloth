import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../Models/category';
import { CategoryService } from '../../Services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../Models/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  productId: string | null = null; // To store the ID of the product being edited
isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();

    // Capture the productId from the route
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductForEdit(this.productId); // Load product for editing if ID exists
    }
  }

  // Initialize the form
  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required],
    });
  }

  // Load categories for dropdown
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  // Load product for editing
  loadProductForEdit(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (product: Product) => {
        console.log('Product to edit:', product); // Debugging log
  
        // Populate the form with product details
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          costPrice: product.costPrice,
          stock: product.stock,
          categoryId: product.category._id, // Assuming category is an object
        });
      },
      error: (err) => {
        console.error('Error loading product for edit:', err);
      },
    });
  }
  

  // Handle form submission
  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData = {
      name: this.productForm.get('name')!.value,
      description: this.productForm.get('description')!.value,
      price: this.productForm.get('price')!.value,
      costPrice: this.productForm.get('costPrice')!.value,
      stock: this.productForm.get('stock')!.value,
      category: this.productForm.get('categoryId')!.value,
    };

    if (this.productId) {
      // Update product
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.router.navigate(['/products', productData.category]);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        },
      });
    } else {
      // Add new product
      this.productService.addProduct(productData).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          this.router.navigate(['/products', productData.category]);
        },
        error: (err) => {
          console.error('Error adding product:', err);
        },
      });
    }
  }
}
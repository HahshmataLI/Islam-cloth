import { Component, OnInit } from '@angular/core';
import { Product } from '../../Models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent  implements OnInit {
  products: Product[] = [];
  categoryId: string | null = null;
  loading = true;  // Add a loading state

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the category ID from the route
    this.categoryId = this.route.snapshot.paramMap.get('id');

    // Fetch products based on the category ID
    if (this.categoryId) {
      this.fetchProductsByCategory(this.categoryId);
    }
  }
  editProduct(productId: string): void {
    this.router.navigate(['/add-product', productId]);
  }
deleteProduct(productId: string): void {
  if (confirm('Are you sure you want to delete this product?')) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        // Refresh the product list after deletion
        if (this.categoryId) {
          this.fetchProductsByCategory(this.categoryId);
        }
      },
      error: (err) => {
        console.error('Error deleting product:', err);
      }
    });
  }
}

  fetchProductsByCategory(categoryId: string): void {
    this.loading = true;  // Show the spinner before the request
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;  // Hide the spinner after the products are fetched
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;  // Hide the spinner even if there's an error
      }
    });
  }
}
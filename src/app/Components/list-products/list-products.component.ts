import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  dtoptions: any = {};
  isLoading: boolean = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [10, 25, 50, 100]
    };
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true; // Start loading
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false; // Stop loading
        this.reinitializeDataTable();
        console.log('Fetched products:', data);
      },
      error: (err) => {
        this.isLoading = false; // Stop loading on error
        console.error('Error fetching products:', err);
        alert('Failed to fetch products.');
      },
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.destroyDataTable();
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.fetchProducts(); // Refresh product list after deletion
          alert('Product deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product. Please try again.');
        },
      });
    }
  }

  // Destroy existing DataTable instance
  destroyDataTable(): void {
    if ($.fn.DataTable.isDataTable('#productDatatable')) {
      $('#productDatatable').DataTable().destroy();
    }
  }

  // Initialize or Reinitialize DataTable
  reinitializeDataTable(): void {
    setTimeout(() => {
      $('#productDatatable').DataTable({
        pagingType: 'full_numbers',
        pageLength: 25,
        lengthMenu: [10, 25, 50, 100],
      });
    }, 1);
  }

  // Cleanup on component destroy
  ngOnDestroy(): void {
    this.destroyDataTable();
  }
}
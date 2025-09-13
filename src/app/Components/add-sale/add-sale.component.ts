import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../../Models/customer';
import { Product } from '../../Models/product';
import { SalesService } from '../../Services/sale.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../Services/customer.service';
import { ProductService } from '../../Services/product.service';
import { Category } from '../../Models/category';
import { CategoryService } from '../../Services/category.service';

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css'
})
export class AddSaleComponent implements OnInit {
  addSaleForm: FormGroup;
  customers: Customer[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  totalAmount: number = 0;
  showProfit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private router: Router,
    private customerService: CustomerService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.addSaleForm = this.fb.group({
      customer: ['', Validators.required],
      category: ['', Validators.required],
      products: this.fb.array([this.createProductFormGroup()]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      profit: [0],
      discount: [0, [Validators.required, Validators.min(0)]], // Discount field
    discountType: ['amount', Validators.required],          // Discount type (default: 'amount')
    });
  }
  toggleProfitVisibility() {
    this.showProfit = !this.showProfit;
  }
  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });

    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = selectElement.value;
    if (categoryId) {
      this.productService.getProductsByCategory(categoryId).subscribe(products => {
        this.products = products;
      });
    } else {
      this.products = [];
    }
  }

  get productControls() {
    return this.addSaleForm.get('products') as FormArray;
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      stock: [{ value: 0, disabled: true }],  // Display stock, disabled for editing
      price: [0],  // Store product price
      costPrice: [0], 
      subtotal: [0] , // Subtotal = price * quantity
      profit:[0]
    });
  }

  addProduct() {
    this.productControls.push(this.createProductFormGroup());
  }

  removeProduct(index: number) {
    this.productControls.removeAt(index);
    this.calculateTotalAmount();
  }

  onProductChange(index: number) {
    const productControl = this.productControls.at(index);
    const selectedProductId = productControl.get('product')?.value;
  
    if (selectedProductId) {
      const selectedProduct = this.products.find(p => p._id === selectedProductId);
      if (selectedProduct) {
        productControl.get('price')?.setValue(selectedProduct.price);
        productControl.get('stock')?.setValue(selectedProduct.stock);
        productControl.get('costPrice')?.setValue(selectedProduct.costPrice);
        productControl.get('stock')?.disable(); // Disable stock control here
        this.calculateSubtotal(index);
      }
    }
  }
  

  validateQuantity(index: number) {
    const productControl = this.productControls.at(index);
    const quantity = productControl.get('quantity')?.value;
    const stock = productControl.get('stock')?.value;

    if (quantity > stock) {
      alert('Quantity exceeds available stock!');
      productControl.get('quantity')?.setValue(stock);  // Limit the quantity to available stock
    }

    this.calculateSubtotal(index);
  }

  calculateSubtotal(index: number) {
    const productControl = this.productControls.at(index);
    const price = productControl.get('price')?.value ?? 0;
    const quantity = productControl.get('quantity')?.value ?? 1;
    const costPrice = this.products.find(p => p._id === productControl.get('product')?.value)?.costPrice ?? 0;
    const subtotal = price * quantity;
  
    productControl.get('subtotal')?.setValue(subtotal);
    this.calculateTotalAmount();
    this.calculateTotalProfit();
  }
  
  calculateTotalProfit() {
    let totalProfit = 0;
    this.productControls.controls.forEach(control => {
      const price = control.get('price')?.value ?? 0;
      const quantity = control.get('quantity')?.value ?? 0;
      const costPrice = this.products.find(p => p._id === control.get('product')?.value)?.costPrice ?? 0;
  
      totalProfit += (price - costPrice) * quantity;
    });
  
    // Set the total profit value in the form (hidden)
    this.addSaleForm.get('profit')?.setValue(totalProfit);
  }
  

  calculateTotalAmount() {
    let total = 0;
    this.productControls.controls.forEach(control => {
      const subtotal = control.get('subtotal')?.value ?? 0;
      total += subtotal;
    });
  
    const discount = this.addSaleForm.get('discount')?.value ?? 0;
    const discountType = this.addSaleForm.get('discountType')?.value;
  
    if (discountType === 'percentage') {
      total -= (total * discount) / 100; // Apply percentage discount
    } else {
      total -= discount; // Apply fixed discount
    }
  
    // Ensure the total is not negative
    total = total < 0 ? 0 : total;
  
    this.totalAmount = total;
    this.addSaleForm.get('totalAmount')?.setValue(total);
  }
  

  onSubmit(): void {
    if (this.addSaleForm.valid) {
      const saleData = { ...this.addSaleForm.value }; // Clone the form data
  
      // Remove totalAmount; let the backend calculate it
      delete saleData.totalAmount;
  
      // Debugging: Log the form data being sent
      console.log('Form Data Sent to Backend:', saleData);
  
      this.salesService.addSale(saleData).subscribe({
        next: (newSale) => {
          console.log('Sale added:', newSale);
          this.router.navigate(['/list-sales']);
        },
        error: (err) => {
          console.error('Error adding sale:', err);
        },
      });
    } else {
      console.error('Form is invalid:', this.addSaleForm);
    }
  }
  
  
}
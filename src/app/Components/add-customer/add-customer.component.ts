import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../Services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent implements OnInit {
  addCustomerForm: FormGroup;
  customerId: string | null = null; // To store the ID of the customer being edited

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute to get route parameters
  ) {
    this.addCustomerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    console.log('Customer ID:', this.customerId); // Check if ID is being received
  
    if (this.customerId) {
      this.customerService.getCustomerById(this.customerId).subscribe({
        next: (customer) => {
          console.log('Customer data:', customer); // Check if customer data is being fetched correctly
          this.addCustomerForm.patchValue({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address
          });
        },
        error: (err) => {
          console.error('Error fetching customer details:', err);
        }
      });
    }
  }
  

  onSubmit(): void {
    if (this.addCustomerForm.valid) {
      const customerData = this.addCustomerForm.value;

      if (this.customerId) {
        // Update existing customer
        this.customerService.updateCustomer(this.customerId, customerData).subscribe({
          next: (updatedCustomer) => {
            console.log('Customer updated:', updatedCustomer);
            this.router.navigate(['/list-customer']);
          },
          error: (err) => {
            console.error('Error updating customer:', err);
          }
        });
      } else {
        // Add new customer
        this.customerService.addCustomer(customerData).subscribe({
          next: (newCustomer) => {
            console.log('Customer added:', newCustomer);
            this.router.navigate(['/list-customer']);
          },
          error: (err) => {
            console.error('Error adding customer:', err);
          }
        });
      }
    }
  }
}
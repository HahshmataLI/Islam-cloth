import { Component, OnDestroy, OnInit } from '@angular/core';
import { Customer } from '../../Models/customer';
import { CustomerService } from '../../Services/customer.service';
import { CommonModule } from '@angular/common';
import { DataTablesModule} from 'angular-datatables';
import DataTable, { Config } from 'datatables.net-dt';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-customer',
  standalone: true,
  imports: [CommonModule,DataTablesModule],
  templateUrl: './list-customer.component.html',
  styleUrl: './list-customer.component.css'
})
export class ListCustomerComponent implements OnInit , OnDestroy {
  customers: Customer[] = [];
  dtoptions: any = {};
  
  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [10, 25, 50, 100]
    };
    this.getCustomers(); // Load data and initialize the DataTable
  }

  // Fetch customers from the service
  getCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.reinitializeDataTable();
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
    });
  }

  // Delete customer by ID with confirmation
  deleteCustomer(id?: string): void {
    if (id) {
      const confirmed = window.confirm('Are you sure you want to delete this customer?');
      if (confirmed) {
        this.destroyDataTable();
        this.customerService.deleteCustomer(id).subscribe({
          next: () => {
            this.getCustomers(); // Refresh customer list after deletion
          },
          error: (err) => {
            console.error('Error deleting customer:', err);
            alert('Error deleting customer. Please try again.');
          }
        });
      }
    }
  }

  // Destroy existing DataTable instance
  destroyDataTable() {
    if ($.fn.DataTable.isDataTable('#customerDatatable')) {
      $('#customerDatatable').DataTable().destroy();
    }
  }

  // Initialize or Reinitialize DataTable
  reinitializeDataTable() {
    setTimeout(() => {
      $('#customerDatatable').DataTable({
        pagingType: 'full_numbers',
        pageLength: 25,
        lengthMenu: [10, 25, 50, 100],
      });
    }, 1);
  }

  // Navigate to Edit
  navigateToEdit(customerId: string): void {
    this.router.navigate(['/add-customer', customerId]);
  }

  // Cleanup on component destroy
  ngOnDestroy(): void {
    this.destroyDataTable();
  }
}

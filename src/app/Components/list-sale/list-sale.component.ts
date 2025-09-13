import { Component, OnInit ,OnDestroy, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { SalesService } from '../../Services/sale.service';
import { Sale } from '../../Models/sale';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import DataTable, { Config } from 'datatables.net-dt';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-sale',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './list-sale.component.html',
  styleUrl: './list-sale.component.css'
})
export class ListSaleComponent implements OnInit, AfterViewInit, OnDestroy {
  sales: Sale[] = [];
  dtoptions: any = {}; // DataTable options
  dttrigger: Subject<any> = new Subject<any>(); // DataTable trigger

  constructor(
    private salesService: SalesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [10, 25, 50, 100],
      order: [[4, 'desc']], // Order by the 5th column (Date) in descending order
      destroy: true, // Ensure reinitialization on data change
    };
    this.getSales();
  }

  ngAfterViewInit(): void {
    this.dttrigger.next(null); // Trigger DataTable initialization
  }

  ngOnDestroy(): void {
    this.dttrigger.unsubscribe(); // Clean up the trigger
  }

  getSales(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.sales = this.sortSalesByDate(data); // Sort sales by date
        this.cdr.detectChanges(); // Ensure view is updated
        this.initializeDataTable(); // Initialize the DataTable
      },
      error: (err) => {
        console.error('Error fetching sales:', err);
      }
    });
  }

  // Sort sales by date (newest first)
  sortSalesByDate(sales: Sale[]): Sale[] {
    return sales.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  initializeDataTable(): void {
    setTimeout(() => {
      const table = $('#saleDatatable').DataTable();
      if (table) {
        table.destroy(); // Destroy the previous instance
      }
      $('#saleDatatable').DataTable(this.dtoptions); // Reinitialize the DataTable
      this.dttrigger.next(null); // Trigger the DataTable update
    }, 100);
  }

  navigateToInvoice(saleId: string): void {
    this.router.navigate(['/invoice', saleId]);
  }

  deleteSale(id: string): void {
    this.salesService.deleteSale(id).subscribe({
      next: () => {
        this.getSales(); // Refresh sales list after deletion
      },
      error: (err) => {
        console.error('Error deleting sale:', err);
      }
    });
  }
}

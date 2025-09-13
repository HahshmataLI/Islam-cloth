import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../Services/sale.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';
import { Sale } from '../../Models/sale';
@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-dashboard.component.html',
  styleUrl: './sales-dashboard.component.css'
})
export class SalesDashboardComponent implements OnInit  {
  totalSales = 0;
  totalCustomers = 0;
  recentSales: Sale[] = []; // Correct type

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.salesService.getSales().subscribe((sales: Sale[]) => {
      // Calculate total sales amount
      this.totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      
      // Calculate total unique customers
      this.totalCustomers = new Set(sales.map(sale => sale.customer._id)).size;
      
      // Sort sales by date in descending order (newest first)
      const sortedSales = sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Only show the first 5 most recent sales
      this.recentSales = sortedSales.slice(0, 5);
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order.service';
import { Order } from '../../Models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.css'
})
export class ListOrderComponent  implements OnInit {
  orders!: Order[];
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders('userId')  // Pass the actual user ID as needed
      .subscribe({
        next: (data) => this.orders = data,
        error: (err) => console.error(err)
      });
  }

  deleteOrder(id: string): void {
    this.orderService.deleteOrder(id)
      .subscribe({
        next: () => this.orders = this.orders.filter(order => order._id !== id),
        error: (err) => console.error(err)
      });
  }
}
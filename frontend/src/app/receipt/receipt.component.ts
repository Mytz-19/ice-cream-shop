import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CreateOrderService } from '../services/create-order.service';
import { SelectedProduct } from '../models';
import { ItemType } from '../models/enums/item-quantity';
import { RestService } from '../services/rest.service';

interface PaymentHistory {
  date: Date;
  amount: number;
  status: 'paid' | 'pending';
  transactionId?: string;
}

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss',
})
export class ReceiptComponent implements OnInit {
  displayedColumns: string[] = ['item', 'quantity', 'price'];
  dataSource = new MatTableDataSource<SelectedProduct>([]);
  employeeName: string = '';
  orderDate: Date = new Date();
  totalCost: number = 0;
  amountPaid: number = 0;
  outstandingBalance: number = 0;
  paymentHistory: PaymentHistory[] = [];
  paymentMethod: string = 'cash';
  showPaymentHistory: boolean = false;
  protected readonly ItemType = ItemType;

  // Add getter for dataSource.data to be used in the template
  get products(): SelectedProduct[] {
    return this.dataSource.data;
  }

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private createOrderService: CreateOrderService,
    private restService: RestService
  ) {}

  ngOnInit() {
    this.dataSource.data = this.createOrderService.selectedProducts;
    this.dataSource.sort = this.sort;

    this.employeeName = this.createOrderService.selectedEmployee?.name || '';
    this.orderDate = new Date();
    this.totalCost = this.calculateTotalCost();
    
    // Load employee's payment history and outstanding balance
    this.loadEmployeePaymentInfo();
  }

  calculateTotalCost(): number {
    return this.createOrderService.selectedProducts.reduce(
      (total, product) => total + product.price,
      0
    );
  }

  loadEmployeePaymentInfo() {
    // TODO: Implement API call to get payment history and outstanding balance
    // This is a mock implementation
    this.outstandingBalance = 1500; // Example value
    this.paymentHistory = [
      {
        date: new Date('2024-05-20'),
        amount: 1000,
        status: 'paid',
        transactionId: 'TRX123'
      },
      {
        date: new Date('2024-05-15'),
        amount: 500,
        status: 'pending'
      }
    ];
  }

  calculateRemainingBalance(): number {
    return this.totalCost - this.amountPaid;
  }

  submit() {
    if (this.amountPaid <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    const payment: PaymentHistory = {
      date: new Date(),
      amount: this.amountPaid,
      status: this.amountPaid >= this.totalCost ? 'paid' : 'pending',
      transactionId: `TRX${Date.now()}`
    };

    this.paymentHistory.push(payment);
    this.outstandingBalance = this.calculateRemainingBalance();

    // TODO: Implement API call to save payment
    console.log('Payment submitted:', payment);
    alert(`Payment of Rs ${this.amountPaid} processed successfully!`);
  }

  togglePaymentHistory() {
    this.showPaymentHistory = !this.showPaymentHistory;
  }

  printReceipt() {
    window.print();
  }
}
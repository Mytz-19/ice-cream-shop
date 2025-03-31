import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateOrderService } from '../services/create-order.service';
import { SelectedProduct } from '../models';
import { ItemType } from '../models/enums/item-quantity';
import { RestService, EmployeePaymentInfo, PaymentHistory } from '../services/rest.service';
import { Subject, takeUntil } from 'rxjs';

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
    MatCheckboxModule,
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss',
})
export class ReceiptComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['item', 'quantity', 'price'];
  dataSource = new MatTableDataSource<SelectedProduct>([]);
  employeeName: string = '';
  employeeId: string = '';
  orderDate: Date = new Date();
  amountPaid: number = 0;
  totalCost: number = 0;
  outstandingBalance: number = 0;
  allowCredit: boolean = false;
  protected readonly ItemType = ItemType;

  private destroy$ = new Subject<void>();

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
    // Subscribe to selected products changes
    this.createOrderService.selectedProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.dataSource.data = products;
        this.totalCost = this.calculateTotalCost();
      });

    // Subscribe to selected employee changes
    this.createOrderService.selectedEmployee$
      .pipe(takeUntil(this.destroy$))
      .subscribe(employee => {
        this.employeeName = employee?.name || '';
        this.employeeId = employee?.id || '';
        if (employee) {
          this.loadEmployeePaymentInfo(employee.id);
        } else {
          // Reset payment info when no employee is selected
          this.outstandingBalance = 0;
        }
      });

    // Initialize sort
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateTotalCost(): number {
    return this.createOrderService.selectedProducts.reduce(
      (total, product) => total + (product.price * product.item_count),
      0
    );
  }

  loadEmployeePaymentInfo(employeeId: string) {
    this.restService.getEmployeePaymentInfo(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (info: EmployeePaymentInfo) => {
          this.outstandingBalance = info.outstandingBalance;
        },
        error: (error: Error) => {
          console.error('Error loading employee payment info:', error);
          // Fallback to mock data if API fails
          this.outstandingBalance = 1500;
        }
      });
  }

  printReceipt() {
    window.print();
  }

  calculateRemainingBalance(): number {
    return (this.totalCost + this.outstandingBalance) - this.amountPaid; 
  }

  canProcessPayment(): boolean {
    // Can process if full payment or if credit is allowed, and amount is positive
    return this.amountPaid > 0 && 
           (this.amountPaid >= (this.totalCost + this.outstandingBalance) || 
            this.allowCredit);
  }

  // Handle negative value prevention
  onAmountInputChange(event: any) {
    // Prevent negative values
    if (event.target.value < 0) {
      this.amountPaid = 0;
    }
  }

  submit() {
    if (this.amountPaid <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    const newOutstandingBalance = this.calculateRemainingBalance() > 0 ? this.calculateRemainingBalance() : 0;
    
    const paymentData = {
      employeeId: this.employeeId,
      orderTotal: this.totalCost,
      previousBalance: this.outstandingBalance,
      amountPaid: this.amountPaid,
      newBalance: newOutstandingBalance,
      creditAllowed: this.allowCredit,
      orderDate: this.orderDate,
      products: this.products
    };

    // TODO: Save the payment data using your service
    console.log('Payment data to be saved:', paymentData);
    
    // Show success message
    if (this.calculateRemainingBalance() > 0 && this.allowCredit) {
      alert(`Payment of Rs ${this.amountPaid} processed. Remaining Rs ${this.calculateRemainingBalance()} added to account.`);
    } else {
      alert(`Payment of Rs ${this.amountPaid} processed successfully!`);
    }
    
    // Reset form
    this.amountPaid = 0;
    this.allowCredit = false;
  }
}
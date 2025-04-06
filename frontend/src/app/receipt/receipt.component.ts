import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateOrderService } from '../services/create-order.service';
import { SelectedProduct } from '../models';
import { ItemType } from '../models/enums/item-quantity';
import { RestService, EmployeePaymentInfo } from '../services/rest.service';
import { Subject, takeUntil } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
    MatSnackBarModule
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss',
})
export class ReceiptComponent implements OnInit, OnDestroy {
  @ViewChild('receiptContainer') receiptContainer!: ElementRef;
  
  displayedColumns: string[] = ['item', 'quantity', 'price'];
  dataSource = new MatTableDataSource<SelectedProduct>([]);
  employeeName: string = '';
  employeeId: string = '';
  orderDate: Date = new Date();
  amountPaid!: number;
  totalCost: number = 0;
  outstandingBalance: number = 0;
  allowCredit: boolean = false;
  paymentProcessed: boolean = false;
  protected readonly ItemType = ItemType;

  private destroy$ = new Subject<void>();

  // Add getter for dataSource.data to be used in the template
  get products(): SelectedProduct[] {
    return this.dataSource.data;
  }

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private createOrderService: CreateOrderService,
    private restService: RestService,
    private snackBar: MatSnackBar,
    private router: Router
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
      this.snackBar.open('Please enter a valid payment amount', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
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
    
    // Mark payment as processed
    this.paymentProcessed = true;
    
    // Show success message
    if (this.calculateRemainingBalance() > 0 && this.allowCredit) {
      this.snackBar.open(
        `Payment of Rs ${this.amountPaid} processed. Remaining Rs ${this.calculateRemainingBalance()} added to account.`, 
        'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        }
      );
    } else {
      this.snackBar.open(
        `Payment of Rs ${this.amountPaid} processed successfully!`, 
        'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
    }
    
    this.createOrderService.updatePaymentStatus(true);
  }
  
  returnToEmployeeSelection() {
    // Reset the service data
    this.createOrderService.resetOrder();
    
    // Navigate to the employee selection page
    this.router.navigate(['/employees']);
    
    // Show a confirmation message
    this.snackBar.open('Ready for a new order!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private generateReceiptHtml(): string {
    // Format date nicely
    const formattedDate = this.orderDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
            
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              background: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .receipt {
              max-width: 380px;
              margin: 0 auto;
              padding: 20px;
              padding-bottom: 40px; // Add extra bottom padding
            }
            
            .header {
              text-align: center;
              margin-bottom: 24px;
              padding-bottom: 16px;
              border-bottom: 2px dashed #e0e0e0;
            }
            
            .title {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              color: #4a148c;
              letter-spacing: 0.5px;
            }
            
            .subtitle {
              margin: 8px 0 0;
              font-size: 14px;
              color: #757575;
            }
            
            .company-info {
              margin: 16px 0;
              font-size: 12px;
              color: #616161;
              line-height: 1.4;
            }
            
            .section {
              margin-bottom: 20px;
            }
            
            .section-title {
              color: #4a148c;
              font-size: 16px;
              font-weight: 500;
              margin: 0 0 12px 0;
              padding-bottom: 6px;
              border-bottom: 1px solid #e0e0e0;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .info-label {
              color: #616161;
              font-weight: 400;
            }
            
            .warning-row {
              color: #d32f2f;
              font-weight: 500;
            }
            
            .success-row {
              color: #388e3c;
              font-weight: 500;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 12px 0;
              font-size: 13px;
            }
            
            .items-table th {
              background: #f5f5f5;
              color: #4a148c;
              text-align: left;
              padding: 8px;
              font-weight: 500;
            }
            
            .items-table td {
              padding: 8px;
              border-bottom: 1px solid #eee;
            }
            
            .items-table tr:last-child td {
              border-bottom: none;
            }
            
            .total-row {
              font-weight: 600;
              margin-top: 12px;
              padding-top: 12px;
              border-top: 1px dashed #bdbdbd;
            }
            
            .grand-total {
              font-size: 16px;
              color: #4a148c;
              font-weight: 700;
            }
            
            .footer {
              text-align: center;
              margin-top: 24px;
              padding-top: 16px;
              border-top: 2px dashed #e0e0e0;
              font-size: 12px;
              color: #757575;
            }
            
            .payment-status {
              padding: 8px 12px;
              border-radius: 4px;
              font-weight: 500;
              font-size: 13px;
              margin-top: 12px;
              text-align: center;
            }
            
            .paid-status {
              background-color: #e8f5e9;
              color: #2e7d32;
            }
            
            .partial-status {
              background-color: #fff8e1;
              color: #ff8f00;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1 class="title">ORDER RECEIPT</h1>
              <p class="subtitle">Transaction #${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
              <div class="company-info">
                Your Company Name<br>
                123 Business Street, City<br>
                Phone: (123) 456-7890
              </div>
            </div>
            
            <div class="section">
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span>${formattedDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Employee:</span>
                <span>${this.employeeName}</span>
              </div>
              ${this.outstandingBalance > 0 ? `
              <div class="info-row warning-row">
                <span class="info-label">Previous Balance:</span>
                <span>Rs ${this.outstandingBalance.toFixed(2)}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="section">
              <h2 class="section-title">ORDER ITEMS</h2>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.products.map(product => `
                    <tr>
                      <td>${product.name}</td>
                      <td>${product.item_count} ${product.item_type === this.ItemType.PIECE ? 'pcs' : 'boxes'}</td>
                      <td>Rs ${product.price.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="info-row total-row">
                <span>Order Total:</span>
                <span>Rs ${this.totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">PAYMENT SUMMARY</h2>
              <div class="info-row">
                <span class="info-label">Order Total:</span>
                <span>Rs ${this.totalCost.toFixed(2)}</span>
              </div>
              ${this.outstandingBalance > 0 ? `
              <div class="info-row">
                <span class="info-label">Previous Balance:</span>
                <span>Rs ${this.outstandingBalance.toFixed(2)}</span>
              </div>
              ` : ''}
              ${this.paymentProcessed ? `
              <div class="info-row">
                <span class="info-label">Amount Paid:</span>
                <span class="success-row">Rs ${this.amountPaid.toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="info-row total-row">
                <span>${this.paymentProcessed ? 'Remaining Balance' : 'Total Amount Due'}:</span>
                <span class="grand-total">Rs ${(this.paymentProcessed ? 
                  (this.totalCost + this.outstandingBalance - this.amountPaid) : 
                  (this.totalCost + this.outstandingBalance)).toFixed(2)}</span>
              </div>
              
              ${this.paymentProcessed ? `
              <div class="payment-status ${this.amountPaid >= (this.totalCost + this.outstandingBalance) ? 'paid-status' : 'partial-status'}">
                ${this.amountPaid >= (this.totalCost + this.outstandingBalance) ? 
                  'PAYMENT COMPLETED' : 
                  'PARTIAL PAYMENT - CREDIT APPLIED'}
              </div>
              ` : ''}
            </div>
            
            <div class="footer">
              Thank you for your business!<br>
              ${new Date().getFullYear()} © Ganga Foods
            </div>
          </div>
        </body>
      </html>
    `;
  }

  printReceipt() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const receiptHtml = this.generateReceiptHtml() + `
      <script>
        setTimeout(() => {
          window.print();
          window.close();
        }, 300);
      </script>
    `;
  
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  }
  
  async downloadReceipt() {
    if (!this.paymentProcessed) return;
  
    // Create a temporary div to hold the printable content
    const printDiv = document.createElement('div');
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    printDiv.style.width = '380px'; // Match the receipt width
    document.body.appendChild(printDiv);
  
    // Use the common receipt HTML generator
    printDiv.innerHTML = this.generateReceiptHtml();
  
    try {
      // Calculate content height to determine PDF size
      const contentHeight = printDiv.scrollHeight;
      const contentWidth = printDiv.scrollWidth;
      
      // Use a custom page size that fits the content
      const pdf = new jsPDF({
        orientation: contentWidth > contentHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [contentWidth, contentHeight]
      });
  
      // Convert the HTML to canvas with proper scaling
      const canvas = await html2canvas(printDiv, {
        scale: 2, // Higher quality
        width: contentWidth,
        height: contentHeight,
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: contentWidth
      });
  
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, contentWidth, contentHeight);
      
      // Download the PDF
      pdf.save(`receipt_${this.employeeName}_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.snackBar.open(
        'Error generating PDF receipt. Please try printing instead.', 
        'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        }
      );
    } finally {
      // Clean up
      document.body.removeChild(printDiv);
    }
  }
}
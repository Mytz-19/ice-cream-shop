import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Employee, PaymentHistory, Products } from '../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { animate, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';
import { SpinnerComponent } from "../shared/spinner/spinner.component";

interface ExtendedOrder extends PaymentHistory {
  employee_name: string;
  showDetails: boolean;
}

@Component({
  selector: 'app-past-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SpinnerComponent
],
  templateUrl: './past-orders.component.html',
  styleUrl: './past-orders.component.scss',
  animations: [
    trigger('detailExpand', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class PastOrdersComponent implements OnInit {
  orders: ExtendedOrder[] = [];
  filteredOrders: ExtendedOrder[] = [];
  employees: Employee[] = [];
  employeeMap: { [id: string]: string } = {}; // Map of employee_id to employee_name
  productMap: { [id: string]: string } = {}; // Map of product_id to product_name
  isLoading: boolean = true;
  searchQuery: string = '';
  products: Products[] = [];

  constructor(private restService: RestService) {}

  ngOnInit(): void {
    this.isLoading = true;
  
    // Wait for both employees and products to load
    forkJoin({
      employees: this.restService.getEmployee(),
      products: this.restService.getProducts()
    }).subscribe({
      next: ({ employees, products }) => {
        // Populate employee map
        this.employees = employees;
        this.employeeMap = employees.reduce((map, employee) => {
          map[employee.id] = employee.name;
          return map;
        }, {} as { [id: string]: string });
  
        // Populate product map
        this.products = products;
        this.productMap = products.reduce((map, product) => {
          map[product.id] = product.name;
          return map;
        }, {} as { [id: string]: string });
  
        // Load orders after employees and products are loaded
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error loading employees or products:', err);
        this.isLoading = false;
      }
    });
  
    // Apply dark theme to document body if not already set
    document.body.classList.add('dark-theme');
  }

  loadEmployees(): void {
    this.restService.getEmployee().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        // Create a map of employee_id to employee_name
        this.employeeMap = employees.reduce((map, employee) => {
          map[employee.id] = employee.name;
          return map;
        }, {} as { [id: string]: string });
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  loadProducts(): void {
    this.restService.getProducts().subscribe({
      next: (products: Products[]) => {
        this.products = products;
        // Create a map of product_id to product_name
        this.productMap = products.reduce((map, product) => {
          map[product.id] = product.name;
          return map;
        }, {} as { [id: string]: string });
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    this.restService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({
          ...order,
          date: new Date(order.date).toISOString(), // Convert date string to Date object and back to ISO string
          employee_name: this.employeeMap[order.employee_id] || 'Unknown', // Map employee_id to employee_name
          receipt: (order.receipt ?? []).map(item => ({
            ...item,
            product_name: this.productMap[item.product_id] || 'Unknown' // Map product_id to product_name
          })),
          showDetails: false // Add showDetails property for UI toggling
        }));
        this.filteredOrders = [...this.orders];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.isLoading = false;
      }
    });
  }

  filterOrders(): void {
    if (!this.searchQuery.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredOrders = this.orders.filter(order => {
      return (order.id?.toLowerCase().includes(query) || false) ||
             (order.employee_name && order.employee_name.toLowerCase().includes(query));
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterOrders();
  }

  toggleOrderDetails(order: ExtendedOrder): void {
    order.showDetails = !order.showDetails;
  }

  printOrder(order: PaymentHistory): void {
    console.log(`Printing order: ${order.id}`);
    // Implement printing functionality
  }

  reorder(order: PaymentHistory): void {
    console.log(`Reordering items from order: ${order.id}`);
    // Implement reorder functionality that pre-populates cart with these items
  }
}
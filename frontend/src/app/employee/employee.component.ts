import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from '../app.component';

import { ItemsComponent } from '../items/items.component';
import { RestService } from '../services/rest.service';
import { CreateOrderService } from '../services/create-order.service';
import { Employee } from '../models';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    ItemsComponent,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  public isToggled = false;
  public employees: Employee[] = [];
  public filteredEmployees: Employee[] = [];
  public searchQuery: string = '';
  selectedEmployee: any = null;

  constructor(
    public createOrderService: CreateOrderService,
    private restService: RestService,
    private router: Router,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.restService.getEmployee().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
      },
      error: (err) => console.log(err),
    });

    this.selectedEmployee = this.createOrderService.selectedEmployee;
  }

  filterEmployees() {
    if (!this.searchQuery) {
      this.filteredEmployees = this.employees;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee => 
      employee.name.toLowerCase().includes(query)
    );
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.createOrderService.selectedEmployee = employee;
  }

  confirmSelection(): void {
    if (this.selectedEmployee) {
      this.createOrderService.selectedEmployee = this.selectedEmployee;
      this.router.navigate(['/items']);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterEmployees();
  }
}
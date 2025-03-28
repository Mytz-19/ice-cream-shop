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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    MatSnackBarModule
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
    private snackBar: MatSnackBar,
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

    // Check if employee is already selected
    const savedEmployee = localStorage.getItem('selectedEmployeeData');
    if (savedEmployee) {
      this.selectedEmployee = JSON.parse(savedEmployee);
    }
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

  selectEmployee(employee: any) {
    this.selectedEmployee = employee;
  }

  confirmSelection() {
    if (this.selectedEmployee) {
      // Save selected employee data
      localStorage.setItem('selectedEmployeeData', JSON.stringify(this.selectedEmployee));
      
      // Update step status in parent component
      this.appComponent.updateStepStatus(1, true);
      
      // Navigate to items page
      this.router.navigate(['/items']);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterEmployees();
  }
}
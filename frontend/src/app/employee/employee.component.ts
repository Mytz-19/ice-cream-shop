import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ItemsComponent } from '../items/items.component';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { RestService } from '../services/rest.service';
import { CreateOrderService } from '../services/create-order.service';
import { Employee } from '../models';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ItemsComponent, SubHeaderComponent, MatButtonModule, MatCardModule, HttpClientModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit{

  public isToggled = false;
  public employees: Employee[] = [];

  constructor(
    public createOrderService: CreateOrderService,
    private restService: RestService
  ) {}

  ngOnInit(): void {
    this.restService.getEmployee()
    .subscribe({
      next: (employees) => this.employees = employees, 
      error: (err) => console.log(err)
    });
  }

  createOrder(employeeId: string): void {
    this.isToggled = 
      employeeId === this.createOrderService.employeeId 
        ? !this.isToggled
        : true;
    

    this.createOrderService.employeeId = employeeId;
    this.createOrderService.isNewOrder = this.isToggled;
  }
}

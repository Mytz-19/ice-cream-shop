import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import { RestService } from '../services/rest.service';
import { Employee } from '../models';
import { ItemsComponent } from '../items/items.component';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { MatCardModule } from '@angular/material/card';
import { CreateOrderService } from '../services/create-order.service';
import { ActionsComponent } from '../actions/actions.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ItemsComponent, SubHeaderComponent, ActionsComponent, MatButtonModule, MatCardModule, HttpClientModule],
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
      next: (employees) => {
        console.log(employees);
        this.employees = employees;
      }, 
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

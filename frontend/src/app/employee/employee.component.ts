import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import { RestService } from '../services/rest.service';
import { Employee } from '../models';
import { Router } from '@angular/router';
import { ItemsComponent } from '../items/items.component';
import { SubHeaderComponent } from '../sub-header/sub-header.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ItemsComponent, SubHeaderComponent, MatButtonModule, HttpClientModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit{

  public employees: Employee[] = [];

  constructor(
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
}

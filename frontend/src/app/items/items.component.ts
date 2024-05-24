import { Component, OnInit } from '@angular/core';

import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { CounterInputComponent } from './counter-input/counter-input.component';
import { Products } from '../models';
import { RestService } from '../services/rest.service';


import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
@Component({
  selector: 'app-items',
  standalone: true,
  imports: [SubHeaderComponent, CounterInputComponent, MatCardModule, MatButtonModule, MatRadioModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  public products: Products[] = [];

  constructor(
    private restService: RestService
  ) {}

  ngOnInit(): void {
    this.restService.getProducts()
    .subscribe({
      next: (products) => {
        this.products = products;
      }, 
      error: (err) => console.log(err)
    });
  }
}

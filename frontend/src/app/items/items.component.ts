import { Component, OnInit } from '@angular/core';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { RestService } from '../services/rest.service';
import { Products } from '../models';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [SubHeaderComponent, MatCardModule, MatButtonModule, MatRadioModule],
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

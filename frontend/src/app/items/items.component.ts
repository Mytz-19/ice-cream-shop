import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { CounterInputComponent } from './counter-input/counter-input.component';
import { ItemQty, ProductsWithQty } from '../models';
import { RestService } from '../services/rest.service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CreateOrderService } from '../services/create-order.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [SubHeaderComponent, CounterInputComponent, MatCardModule, MatButtonModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  public products: ProductsWithQty[] = [];
  public selectedQty: ItemQty = ItemQty.PIECE;
  public selectedProducts: ProductsWithQty[] = [];
  protected readonly ItemQty = ItemQty;

  constructor(
    public createOrderService: CreateOrderService,
    private restService: RestService
  ) {}

  ngOnInit(): void {
    this.restService.getProducts()
    .pipe(
      map(products => products.map(product => ({...product, selectedQty: ItemQty.PIECE, disable: false}))
    ))
    .subscribe({
      next: (products) => {
        this.products = products;
      }, 
      error: (err) => console.log(err)
    });
  }

  saveItems(product: ProductsWithQty): void {
    const existingProduct = this.isProductAdded(product);
    if (!existingProduct) {
      product.disable = true;
      this.selectedProducts.push(product);
    }
    this.createOrderService.selectedProducts = this.selectedProducts;
  }

  isProductAdded(product: ProductsWithQty): ProductsWithQty|undefined {
    return this.selectedProducts.find(p => p.id === product.id);
  }

  enableItems(product: ProductsWithQty): void {
    const existingProduct = this.isProductAdded(product);
    if (existingProduct) {
      product.disable = false;
    }
    this.selectedProducts = this.selectedProducts.filter(item => item.id !== product.id);
    this.createOrderService.selectedProducts = this.selectedProducts;
  }
}


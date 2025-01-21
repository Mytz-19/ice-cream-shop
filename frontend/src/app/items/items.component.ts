import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

import { ActionsComponent } from '../actions/actions.component';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { CounterInputComponent } from './counter-input/counter-input.component';
import { RestService } from '../services/rest.service';
import { CreateOrderService } from '../services/create-order.service';
import { ItemType, SelectedProduct } from '../models';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ActionsComponent, SubHeaderComponent, CounterInputComponent, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  public products: SelectedProduct[] = [];
  public selectedProducts: SelectedProduct[] = [];
  protected readonly ItemType = ItemType;

  constructor(
    public createOrderService: CreateOrderService,
    private restService: RestService
  ) {}

  ngOnInit(): void {
    this.restService.getProducts()
    .pipe(
      map(products => products.map(product => ({...product, item_type: ItemType.PIECE, item_count: product.piece.qty, disable: false, price: product.piece.price}))
    ))
    .subscribe({
      next: (products) => {
        this.products = products;
      }, 
      error: (err) => console.log(err)
    });
  }

 
  isProductSelected(product: SelectedProduct): boolean {
    return this.selectedProducts.includes(product);
  }

  toggleProductSelection(product: SelectedProduct): void {
    if (this.isProductSelected(product)) {
      this.enableProduct(product);
    } else {
      this.saveProduct(product);
    }
  }

  saveProduct(product: SelectedProduct): void {
    product.disable = true; // for the products[] and selectedProducts[]
    this.selectedProducts.push(product);
    this.createOrderService.selectedProducts = this.selectedProducts;
  }

  enableProduct(product: SelectedProduct): void {
    product.disable = false; // for the products[] and selectedProducts[]
    product.item_count = 1; // Reset the stepper to 1
    product.price = product.item_type === ItemType.PIECE ? product.piece.price : product.box ? product.box.price : 0;
    this.selectedProducts = this.selectedProducts.filter(p => p !== product);
    this.createOrderService.selectedProducts = this.selectedProducts;
  }

  selectItemType(product: SelectedProduct, type: ItemType): void {
    product.item_type = type;
    if(type === ItemType.BOX) this.updateProductCost(1, product);
  }

  updateProductCost($event: number, product: SelectedProduct): void {
    product.item_count = $event;
    if(product.item_type === ItemType.PIECE) {
      product.price = $event * product.piece.price;
    }
    if(product.item_type === ItemType.BOX && product.box) {
      product.price = $event * product.box.price;
    }
  }
}
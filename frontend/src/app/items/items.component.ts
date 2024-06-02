import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

import { ActionsComponent } from '../actions/actions.component';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { CounterInputComponent } from './counter-input/counter-input.component';
import { RestService } from '../services/rest.service';
import { CreateOrderService } from '../services/create-order.service';
import { ItemType, SelectedProduct } from '../models';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [ActionsComponent, SubHeaderComponent, CounterInputComponent, MatCardModule, MatButtonModule],
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

  selectItemType(product: SelectedProduct, type: ItemType): void {
    product.item_type = type;
    if(type === ItemType.BOX) this.updateProductCost(1, product);
  }

  updateProductCost($event: number, product: SelectedProduct): void {
    if(product.item_type === ItemType.PIECE) {
      product.item_count = $event;
      product.price = $event * product.piece.price;
    }
    if(product.item_type === ItemType.BOX && product.box) {
      product.item_count = $event;
      product.price = $event * product.box.price;
    }
  }

  saveProduct(product: SelectedProduct): void {
    product.disable = true; // for the products[] and selectedProducts[]
    this.selectedProducts.push(product);

    this.createOrderService.selectedProducts = this.selectedProducts;
  }

  isProductSelected(product: SelectedProduct): SelectedProduct|undefined {
    return this.selectedProducts.find(p => p.id === product.id);
  }

  enableProduct(product: SelectedProduct): void {
    product.disable = false;

    this.selectedProducts = this.selectedProducts.filter(item => item.id !== product.id);
    this.createOrderService.selectedProducts = this.selectedProducts;
  }
}


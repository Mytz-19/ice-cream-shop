import { Component, Input } from '@angular/core';

import { CreateOrderService } from '../services/create-order.service';
import { ProductsWithQty, Routes } from '../models';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {

  @Input()
  public selectedProducts: ProductsWithQty[] = [];

  // calculateProductsPrice(): number {

  // }
}

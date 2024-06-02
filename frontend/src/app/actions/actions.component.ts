import { Component, Input } from '@angular/core';

import { SelectedProduct } from '../models';

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
  public selectedProducts: SelectedProduct[] = [];

  calculateProductsPrice(): number {
    return this.selectedProducts.reduce((total, pdt) => total + pdt.price, 0);
  }
}

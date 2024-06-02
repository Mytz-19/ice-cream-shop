import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SelectedProduct } from '../models';


@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
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

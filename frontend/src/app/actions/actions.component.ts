import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ItemType, SelectedProduct } from '../models';


@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {

  @Input()
  public selectedProducts: SelectedProduct[] = [];
  public isExpanded: boolean = false;

  protected readonly ItemType = ItemType;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  calculateProductsPrice(): number {
    return this.selectedProducts.reduce((total, pdt) => total + pdt.price, 0);
  }
}

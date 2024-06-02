import { Injectable } from '@angular/core';
import { SelectedProduct } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  constructor() { }

  private _employeeId = '';
  private _selectedProducts: SelectedProduct[] =[];

  public set employeeId(val: string) {
    this._employeeId = val;
  }

  public get employeeId(): string {
    return this._employeeId;
  }

  public set selectedProducts(items: SelectedProduct[]) {
    this._selectedProducts = items;
  }

  public get selectedProducts(): SelectedProduct[] {
    return this._selectedProducts;
  }
}

import { Injectable } from '@angular/core';
import { ProductsWithQty } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  constructor() { }

  private _isNewOrder = false;
  private _employeeId = '';
  private _selectedProducts: ProductsWithQty[] =[];

  public set isNewOrder(val: boolean) {
    this._isNewOrder = val;
  }

  public get isNewOrder(): boolean {
    return this._isNewOrder;
  }

  public set employeeId(val: string) {
    this._employeeId = val;
  }

  public get employeeId(): string {
    return this._employeeId;
  }
  
  public set selectedProducts(selectedItems: ProductsWithQty[]) {
    this._selectedProducts = selectedItems;
  }

  public get selectedProducts(): ProductsWithQty[] {
    return this._selectedProducts;
  }
}

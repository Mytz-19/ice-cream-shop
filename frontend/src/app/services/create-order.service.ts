import { Injectable } from '@angular/core';
import { ProductsWithQty } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  constructor() { }

  private _isNewOrder = false;
  private _employeeId = '';
  private _addedItem!: ProductsWithQty;

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
  
  public set addedItem(val: ProductsWithQty) {
    this._addedItem = val;
  }

  public get addedItem(): ProductsWithQty {
    return this._addedItem;
  }
}

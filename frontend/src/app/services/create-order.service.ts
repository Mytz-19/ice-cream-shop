import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  constructor() { }

  private _isNewOrder = false;
  private _employeeId = '';

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
  
}

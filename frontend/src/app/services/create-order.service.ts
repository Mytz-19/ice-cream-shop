import { Injectable } from '@angular/core';
import { Employee, SelectedProduct } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {

  constructor() { }

  public _selectedEmployee: Employee | null = null
  private _selectedProducts: SelectedProduct[] =[];

  // Getter for selectedEmployee
  get selectedEmployee(): Employee | null {
    return this._selectedEmployee;
  }

  // Setter for selectedEmployee
  set selectedEmployee(employee: Employee | null) {
    this._selectedEmployee = employee;
  }

  public set selectedProducts(items: SelectedProduct[]) {
    this._selectedProducts = items;
  }

  public get selectedProducts(): SelectedProduct[] {
    return this._selectedProducts;
  }
}

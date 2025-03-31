import { Injectable } from '@angular/core';
import { Employee, SelectedProduct } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {
  private _selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  private _selectedProductsSubject = new BehaviorSubject<SelectedProduct[]>([]);
  private isPaymentCompleted: boolean = false;

  // Expose observables
  selectedEmployee$ = this._selectedEmployeeSubject.asObservable();
  selectedProducts$ = this._selectedProductsSubject.asObservable();

  constructor() { }

  // Getter for selectedEmployee
  get selectedEmployee(): Employee | null {
    return this._selectedEmployeeSubject.value;
  }

  // Setter for selectedEmployee
  set selectedEmployee(employee: Employee | null) {
    this._selectedEmployeeSubject.next(employee);
  }

  public set selectedProducts(items: SelectedProduct[]) {
    this._selectedProductsSubject.next(items);
  }

  public get selectedProducts(): SelectedProduct[] {
    return this._selectedProductsSubject.value;
  }

  // Helper method to add a product to the selection
  addProduct(product: SelectedProduct) {
    const currentProducts = this._selectedProductsSubject.value;
    const existingIndex = currentProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      // Update existing product
      const updatedProducts = [...currentProducts];
      updatedProducts[existingIndex] = product;
      this._selectedProductsSubject.next(updatedProducts);
    } else {
      // Add new product
      this._selectedProductsSubject.next([...currentProducts, product]);
    }
  }

  // Helper method to remove a product from the selection
  removeProduct(productId: string) {
    const currentProducts = this._selectedProductsSubject.value;
    this._selectedProductsSubject.next(currentProducts.filter(p => p.id !== productId));
  }

  // Helper method to clear all selections
  clearSelections() {
    this._selectedEmployeeSubject.next(null);
    this._selectedProductsSubject.next([]);
  }

  updatePaymentStatus(completed: boolean) {
    this.isPaymentCompleted = completed;
    if (completed) {
      localStorage.setItem('paymentCompleted', 'true');
    } else {
      localStorage.removeItem('paymentCompleted');
    }
  }
}

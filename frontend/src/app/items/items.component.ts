import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ActionsComponent } from './actions/actions.component';
import { CounterInputComponent } from './counter-input/counter-input.component';
import { RestService } from '../services/rest.service';
import { CreateOrderService } from '../services/create-order.service';
import { ItemType, SelectedProduct } from '../models';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ActionsComponent,
    CounterInputComponent,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
  public searchQuery: string = '';
  public products: SelectedProduct[] = [];
  public filteredProducts: SelectedProduct[] = [];
  public selectedProducts: SelectedProduct[] = [];
  public selectedCategory: string = 'all';
  public isLoading: boolean = true;
  public isCartVisible: boolean = false;
  public cartItems: SelectedProduct[] = [];
  public cartTotal: number = 0;
  protected readonly ItemType = ItemType;
  public selectedFilter: 'all' | 'pieces' | 'boxes' = 'all';

  constructor(
    public createOrderService: CreateOrderService,
    private restService: RestService,
    private router: Router,
  ) {}

  get selectedCartProducts(): SelectedProduct[] {
    return this.createOrderService.selectedProducts;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      this.isLoading = true;
      const response = await this.restService.getProducts().toPromise();
      if (response) {
        this.products = response.map(product => ({
          ...product,
          item_type: ItemType.PIECE,
          item_count: 1,
          disable: false,
          price: product.piece.price,
          basePrice: product.piece.price, // Add basePrice
          displayPrice: product.piece.price, // Add displayPrice
          category: this.determineCategory(product.name)
        }));
        this.filterProducts();
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading products:', error);
      this.isLoading = false;
    }
  }

  determineCategory(productName: string): string {
    const name = productName.toLowerCase();
    if (name.includes('cone')) return 'cones';
    if (name.includes('cup')) return 'cups';
    if (name.includes('sundae')) return 'sundaes';
    if (name.includes('box')) return 'boxes';
    return 'all';
  }

  filterProducts() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (this.selectedFilter === 'pieces') {
          return !product.box;
        } else if (this.selectedFilter === 'boxes') {
          return product.box;
        }
        return true;
      });
    }

    this.filteredProducts = filtered;
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterProducts();
  }

  updateSelectedProducts() {
    this.selectedProducts = [...this.createOrderService.selectedProducts];
  }

  // Keep this calculation as is
  updateCartTotal(): void {
    this.cartTotal = this.createOrderService.selectedProducts.reduce(
      (total, product) => total + (product.price * product.item_count),
      0
    );
  }

  getProductImage(productName: string): string {
    // TODO: Implement proper image mapping
    return 'assets/images/ice-cream.png';
  }

  isProductInCart(product: SelectedProduct): boolean {
    return this.createOrderService.selectedProducts.some(p => p.id === product.id);
  }

  toggleProductSelection(product: SelectedProduct): void {
    if (this.isProductInCart(product)) {
      this.createOrderService.removeProduct(product.id);
      product.disable = false;
      product.item_count = 1;
    } else {
      this.createOrderService.addProduct(product);
      product.disable = true;
    }
    this.updateSelectedProducts();
    this.updateCartTotal(); // Ensure this is called
  }
  
  removeFromCart(item: SelectedProduct): void {
    const originalProduct = this.products.find(p => p.id === item.id);
    if (originalProduct) {
      originalProduct.disable = false;
      originalProduct.item_count = 1;
      originalProduct.item_type = ItemType.PIECE;
      if (originalProduct.piece) {
        originalProduct.price = originalProduct.piece.price;
      }
    }
    
    this.createOrderService.removeProduct(item.id);
    this.updateCartTotal(); // Ensure this is called
    
    if (!this.hasSelectedItems()) {
      this.isCartVisible = false;
    }
  }
  
  // Update this method to only track quantity changes
  updateProductCost($event: number, product: SelectedProduct): void {
    product.item_count = $event;  // Only update quantity
    this.updateCartTotal();       // Update the total
  }

  // Update item type selection
  selectItemType(product: SelectedProduct, type: ItemType): void {
    product.item_type = type;
    product.item_count = 1;  // Reset quantity when changing type
    if (type === ItemType.PIECE) {
      product.price = product.piece.price;  // Set base price for piece
    } else if (type === ItemType.BOX && product.box) {
      product.price = product.box.price;    // Set base price for box
    }
    this.updateCartTotal();
  }

  clearCart(): void {
    this.createOrderService.selectedProducts.forEach(product => {
      this.removeFromCart(product);
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/receipt']);
  }

  isItemSelected(item: SelectedProduct): boolean {
    return this.selectedProducts.some(selectedItem => selectedItem.id === item.id);
  }

  toggleItemSelection(item: SelectedProduct) {
    const index = this.selectedProducts.findIndex(selectedItem => selectedItem.id === item.id);
    if (index === -1) {
      this.selectedProducts.push(item);
    } else {
      this.selectedProducts.splice(index, 1);
    }
  }

  hasSelectedItems(): boolean {
    return this.createOrderService.selectedProducts && this.createOrderService.selectedProducts.length > 0;
  }

  confirmSelection() {
    if (this.hasSelectedItems()) {
      // Save selected items data
      // localStorage.setItem('selectedItemsData', JSON.stringify(this.selectedProducts));
      
      // Navigate to receipt page
      this.router.navigate(['/receipt']);
    }
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  setFilter(filter: 'all' | 'pieces' | 'boxes') {
    this.selectedFilter = filter;
    this.filterProducts();
  }
}
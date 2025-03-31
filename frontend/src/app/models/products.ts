import { ItemType } from "./enums/item-quantity";

export interface ProductsPerQty {
    qty: number;
    price: number;
}

export interface Products {
    id: string;
    name: string;
    piece: ProductsPerQty;
    box?: ProductsPerQty;
}

export interface SelectedProduct extends Products {
    item_type: ItemType;
    item_count: number;
    disable: boolean;
    price: number;
    category: string;
    basePrice: number;      // The single item price
    displayPrice: number;   // The calculated price (basePrice * quantity)
}

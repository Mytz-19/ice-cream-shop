import { ItemType } from "./enums/item-quantity";
import { Products } from "./products";

export interface Cart {
    id: string;
    name: string;
    item_type: ItemType;
    item_count: number;
    price: number;
    product: Products;
}
import { ItemQty } from "./enums/item-quantity";

export interface Products {
    id: string;
    name: string;
    price: number;
}

export interface ProductsWithQty extends Products{
    selectedQty: ItemQty;
    disable: boolean;
}
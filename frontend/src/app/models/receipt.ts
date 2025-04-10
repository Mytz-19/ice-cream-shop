export interface PaymentHistory {
    id?: string; // Optional ID for the payment
    date: string; // ISO string format
    total_cost: number;
    outstanding_amt?: number;
    employee_id: string;
    receipt?: Receipt[];
}

export interface Receipt {
    cost: number;
    product_id: string;
    product_name?: string; // Optional for mapping
    quantity: number;
}
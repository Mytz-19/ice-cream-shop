import { Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { EmployeeComponent } from './employee/employee.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { PastOrdersComponent } from './past-orders/past-orders.component';

export const routes: Routes = [
    { path: '', redirectTo: '/employees', pathMatch: 'full'},
    { path: 'employees', component: EmployeeComponent },
    { path: 'items', component: ItemsComponent },
    { path: 'receipt', component: ReceiptComponent },
    { path: 'past-orders', component: PastOrdersComponent },
    { path: '**', redirectTo: '/employees', pathMatch: 'full' },
];

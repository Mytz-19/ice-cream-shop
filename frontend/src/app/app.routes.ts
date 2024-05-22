import { Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { EmployeeComponent } from './employee/employee.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';

export const routes: Routes = [
    { path: '', redirectTo: '/employees', pathMatch: 'full'},
    { path: 'employees', component: EmployeeComponent },
    { path: 'items', component: ItemsComponent },
    { path: 'sub-header', component: SubHeaderComponent }
];

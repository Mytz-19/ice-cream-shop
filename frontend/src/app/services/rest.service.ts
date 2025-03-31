import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, Products } from '../models';

export interface EmployeePaymentInfo {
  outstandingBalance: number;
  paymentHistory: PaymentHistory[];
}

export interface PaymentHistory {
  date: Date;
  amount: number;
  status: 'paid' | 'pending';
  transactionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  // private apiPath = "http://127.0.0.1:8080";
  private apiPath = "https://ice-cream-shop-yhr5.onrender.com";

  constructor(protected http: HttpClient) { }

  public getEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiPath+'/employees');
  }

  public getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.apiPath+'/products');
  }

  public getEmployeePaymentInfo(employeeId: string): Observable<EmployeePaymentInfo> {
    // TODO: Replace with actual API endpoint
    return this.http.get<EmployeePaymentInfo>(`${this.apiPath}/employees/${employeeId}/payment-info`);
  }

  public submitPayment(payment: PaymentHistory): Observable<void> {
    // TODO: Replace with actual API endpoint
    return this.http.post<void>(`${this.apiPath}/payments`, payment);
  }
}

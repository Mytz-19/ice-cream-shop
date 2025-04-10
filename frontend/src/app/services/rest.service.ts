import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, PaymentHistory, Products } from '../models';


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

  // public getEmployeePaymentInfo(employeeId: string): Observable<EmployeePaymentInfo> {
  //   // TODO: Replace with actual API endpoint
  //   return this.http.get<EmployeePaymentInfo>(`${this.apiPath}/employees/${employeeId}/payment-info`);
  // }

  public submitPayment(payment: any): Observable<string> {
    return this.http.post<string>(`${this.apiPath}/order`, payment);
  }

  getOrders(): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.apiPath}/orders`);
  }
}

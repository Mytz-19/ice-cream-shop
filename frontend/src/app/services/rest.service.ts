import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, Products } from '../models';

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
}

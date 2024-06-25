import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product';
import { CartItem } from '../models/cart';
import { SaleHistory } from '../models/saleHistory';
import { CategorySummary } from '../models/categorySummary';
import { ProductSummary } from '../models/productSummary';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  url = `${environment.apiUrl}/sales`;
  messageSubject: Subject<any>;

  constructor(private http: HttpClient) {
    this.messageSubject = new Subject<any>();
  }

  createSale(cartItems: any) {
    return this.http.post(this.url, cartItems);
  }
}

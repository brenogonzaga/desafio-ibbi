import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { SaleHistory } from '../models/saleHistory';
import { CategorySummary } from '../models/categorySummary';
import { ProductSummary } from '../models/productSummary';
import { Observable, Subject } from 'rxjs';

interface SalesData {
  sales_history: SaleHistory[];
  category_summary: CategorySummary[];
  top_sold_products: ProductSummary[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private socket: WebSocket;
  private salesData: SalesData = {} as SalesData;
  private messageSubject: Subject<SalesData> = new Subject<SalesData>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const url = `${environment.apiUrl.replace(
      'http://',
      'ws://'
    )}/ws/dashboard`;
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.salesData = {
        sales_history: data.sales_history,
        category_summary: data.category_summary,
        top_sold_products: data.top_sold_products,
      };
      this.messageSubject.next(this.salesData);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.socket.onclose = (event) => {
      console.warn('WebSocket closed:', event);
    };
  }

  getSalesData(): Observable<SalesData> {
    return this.messageSubject.asObservable();
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}

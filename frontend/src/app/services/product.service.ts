import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url_admin = `${environment.apiUrl}/admin/products`;
  url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  listProducts(
    skip: number = 0,
    limit: number = 10,
    description?: string,
    categoryIds?: number[]
  ): Observable<Product[]> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    if (description) {
      params = params.set('description', description);
    }

    if (categoryIds && categoryIds.length > 0) {
      const categoryIdsParam = categoryIds.join(',');
      params = params.set('category_ids', categoryIdsParam);
    }

    return this.http.get<Product[]>(this.url, { params });
  }

  getProductById(id: number) {
    return this.http.get(`${this.url_admin}/${id}`);
  }

  createProduct(product: any) {
    return this.http.post(this.url_admin, product);
  }

  updateProduct(product: any) {
    return this.http.put(`${this.url_admin}/${product.id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.url_admin}/${id}`);
  }
}

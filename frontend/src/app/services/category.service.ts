import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url_admin = `${environment.apiUrl}/admin/categories`;
  url = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient, private router: Router) {}

  listCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  listCategoryByID(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  createCategory(category: any) {
    return this.http.post(this.url_admin, category);
  }

  updateCategory(id: number, category: any) {
    return this.http.put(`${this.url_admin}/${id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.url_admin}/${id}`);
  }
}

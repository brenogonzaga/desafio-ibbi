import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '@root/app/models/product';
import { ProductService } from '@root/app/services/product.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProductCardComponent } from './product-card/product-card.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProductCardComponent,
    CategoryFilterComponent,
  ],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentPage: number = 0;
  limit: number = 10;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const skip = this.currentPage * this.limit;
    this.productService.listProducts(skip, this.limit).subscribe((response) => {
      if (response) {
        this.products = response;
        this.filteredProducts = response;
      }
    });
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage() {
    this.currentPage++;
    this.loadProducts();
  }
}

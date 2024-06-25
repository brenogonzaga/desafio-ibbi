import { Component, OnInit } from '@angular/core';
import { ProductService } from '@root/app/services/product.service';
import { Product } from '@root/app/models/product';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@root/app/components/navbar/navbar.component';

@Component({
  selector: 'list-product',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterLink,
    CardModule,
    CommonModule,
    NavbarComponent,
  ],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  skip: number = 0;
  limit: number = 10;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService
      .listProducts(this.skip, this.limit)
      .subscribe((products) => {
        this.products = products;
      });
  }

  nextPage() {
    this.skip += this.limit;
    this.loadProducts();
  }

  previousPage() {
    this.skip = Math.max(0, this.skip - this.limit);
    this.loadProducts();
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        // Handle error
      },
    });
  }

  updateProduct(productId: number) {}
}

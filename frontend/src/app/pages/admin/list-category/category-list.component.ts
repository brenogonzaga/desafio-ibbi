import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '@root/app/components/navbar/navbar.component';
import { CategoryService } from '@root/app/services/category.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [
    CardModule,
    NavbarComponent,
    CommonModule,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.listCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        // Handle error
      },
    });
  }

  updateCategory(categoryId: number) {
    this.router.navigate([`/admin/categories/update/${categoryId}`]);
  }

  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        // Handle error
      },
    });
  }
}

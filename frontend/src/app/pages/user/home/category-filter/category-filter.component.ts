import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Category } from '@root/app/models/category';
import { Product } from '@root/app/models/product';
import { CategoryService } from '@root/app/services/category.service';
import { ProductService } from '@root/app/services/product.service';
import { FilterService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MultiSelectModule,
    FloatLabelModule,
    InputTextModule,
  ],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent implements OnInit {
  @Input() products: Product[] = [];
  @Output() productsChange = new EventEmitter<Product[]>();

  availableCategories: Category[] = [];
  filterFormGroup = new FormGroup({
    description: new FormControl(''),
    categories: new FormControl([]),
  });

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.setupFilter();
  }

  getCategoriesNames(categories: Category[]) {
    return categories.map((category) => ({
      label: category.description,
      value: category.id,
    }));
  }

  loadCategories() {
    this.categoryService.listCategories().subscribe((categories) => {
      this.availableCategories = categories;
    });
  }

  setupFilter() {
    this.filterFormGroup.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      let { description, categories } = this.filterFormGroup.value;

      if (!description || description === '') {
        description = '';
      }
      const categoryIds = categories
        ? categories.map((category: { label: string; value: number }) => {
            return category.value;
          })
        : [];
      this.productService
        .listProducts(0, 10, description, categoryIds)
        .subscribe((products: Product[] | undefined) => {
          this.productsChange.emit(products);
        });
    });
  }
}

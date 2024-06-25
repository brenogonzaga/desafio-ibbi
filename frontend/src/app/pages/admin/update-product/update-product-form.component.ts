import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '@root/app/components/navbar/navbar.component';
import { CategoryService } from '@root/app/services/category.service';
import { ProductService } from '@root/app/services/product.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'update-product-form',
  standalone: true,
  imports: [
    DropdownModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    NavbarComponent,
  ],
  templateUrl: './update-product-form.component.html',
  styleUrls: ['./update-product-form.component.scss'],
})
export class UpdateProductFormComponent implements OnInit {
  productFormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    low_stock_alert: new FormControl('', Validators.required),
    image_url: new FormControl('', Validators.required),
  });

  categoryControl = new FormControl<{ label: string; value: number }>(
    {} as { label: string; value: number },
    Validators.required
  );

  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProductDetails();
  }

  loadCategories() {
    this.categoryService.listCategories().subscribe((categories) => {
      this.categories = categories.map((category) => ({
        label: category.description,
        value: category.id,
      }));
    });
  }

  loadProductDetails() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const productIdNumber = Number(productId);
      this.productService
        .getProductById(productIdNumber)
        .subscribe((product) => {
          this.productFormGroup.patchValue(product);
        });
    }
  }

  handleUpdateProduct() {
    if (this.productFormGroup.invalid || this.categoryControl.invalid) {
      this.handleInvalidForm();
      return;
    }

    const productData = {
      ...this.productFormGroup.value,
      category_id: this.categoryControl.value?.value,
    };

    this.productService.updateProduct(productData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {},
    });
  }

  handleInvalidForm() {}
}

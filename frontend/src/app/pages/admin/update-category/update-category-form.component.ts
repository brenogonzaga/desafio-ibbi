import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '@root/app/components/navbar/navbar.component';
import { CategoryService } from '@root/app/services/category.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'update-category',
  standalone: true,
  imports: [
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterLink,
    CardModule,
    NavbarComponent,
  ],
  templateUrl: './update-category-form.component.html',
  styleUrls: ['./update-category-form.component.scss'],
})
export class UpdateCategoryFormComponent implements OnInit {
  categoryFormData = new FormGroup({
    description: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  categoryId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      const categoryIdNumber = Number(this.categoryId);
      this.categoryService.listCategoryByID(categoryIdNumber).subscribe({
        next: (category) => {
          this.categoryFormData.setValue({
            description: category.description,
          });
        },
        error: (error) => {
          // Handle error
        },
      });
    }
  }

  handleUpdateCategory() {
    const { description } = this.categoryFormData.value;
    if (this.categoryFormData.invalid || !description) {
      this.handleInvalidForm();
      return;
    }

    const categoryData = { description };
    if (this.categoryId) {
      const categoryIdNumber = Number(this.categoryId);

      console.log(categoryData, categoryIdNumber);
      this.categoryService
        .updateCategory(categoryIdNumber, categoryData)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/admin/categories']);
          },
          error: (error) => {
            // Handle error
          },
        });
    }
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  handleInvalidForm() {}
}

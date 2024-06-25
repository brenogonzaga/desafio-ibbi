import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '@root/app/components/navbar/navbar.component';
import { CategoryService } from '@root/app/services/category.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'create-category',
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
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent {
  productFormData = new FormGroup({
    description: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  handleCreateCategory() {
    const { description } = this.productFormData.value;
    if (this.productFormData.invalid || !description) {
      this.handleInvalidForm();
      return;
    }
    this.categoryService.createCategory({ description }).subscribe({
      next: (response) => {
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        // Handle error, show error message
      },
    });
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  handleInvalidForm() {}
}

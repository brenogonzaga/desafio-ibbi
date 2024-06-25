import { Routes } from '@angular/router';
import { authGuard } from '../auth.guard';
import { LoginComponent } from '../pages/auth/login/login.component';
import { UserRootComponent } from '../pages/user/user-root.component';
import { AdminRootComponent } from '../pages/admin/admin-root.component';
import { SignUpComponent } from '../pages/auth/signup/signup.component';
import { RecoverAccountComponent } from '../pages/auth/recover/recover-account.component';
import { ProductFormComponent } from '../pages/admin/create-product/product-form.component';
import { CategoryFormComponent } from '../pages/admin/create-category/category-form.component';
import { ProductListComponent } from '../pages/admin/list-product/product-list.component';
import { CategoryListComponent } from '../pages/admin/list-category/category-list.component';
import { UpdateCategoryFormComponent } from '../pages/admin/update-category/update-category-form.component';
import { UpdateProductFormComponent } from '../pages/admin/update-product/update-product-form.component';

export const routes: Routes = [
  {
    path: '',
    component: UserRootComponent,
    canActivate: [() => authGuard(['user', 'admin'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@pages/user/home/user-home.component').then(
            (m) => m.UserHomeComponent
          ),
        canActivate: [() => authGuard(['user', 'admin'])],
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('@pages/user/cart/cart.component').then(
            (m) => m.CartComponent
          ),
        canActivate: [() => authGuard(['user', 'admin'])],
      },
    ],
  },
  {
    path: 'admin',
    component: AdminRootComponent,
    canActivate: [() => authGuard(['admin'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@pages/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [() => authGuard(['admin'])],
      },
    ],
  },
  {
    path: 'admin/products/create',
    component: ProductFormComponent,
    canActivate: [() => authGuard(['admin'])],
  },
  {
    path: 'admin/categories/create',
    component: CategoryFormComponent,
    canActivate: [() => authGuard(['admin'])],
  },
  {
    path: 'admin/categories/update/:id',
    component: UpdateCategoryFormComponent,
    canActivate: [() => authGuard(['admin'])],
  },
  {
    path: 'admin/view-products',
    component: ProductListComponent,
    canActivate: [() => authGuard(['admin'])],
  },
  {
    path: 'admin/view-categories',
    component: CategoryListComponent,
    canActivate: [() => authGuard(['admin'])],
  },
  {
    path: 'admin/product/update/:id',
    component: UpdateProductFormComponent,
    canActivate: [() => authGuard(['admin'])],
  },
  { path: 'entrar', component: LoginComponent },
  { path: 'cadastrar', component: SignUpComponent },
  { path: 'recuperarconta', component: RecoverAccountComponent },
  { path: '**', redirectTo: '' },
];

import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@root/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '@root/app/services/cart.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ButtonModule,
    BadgeModule,
    DropdownModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input()
  links: { name: string; path: string }[];

  categoryItems = [
    {
      label: 'Cadastrar Categorias',
      icon: 'pi pi-fw pi-plus',
      routerLink: '/admin/categories/create',
    },
    {
      label: 'Ver Categorias',
      icon: 'pi pi-fw pi-eye',
      routerLink: '/admin/view-categories',
    },
  ];

  productItems = [
    {
      label: 'Cadastrar Produtos',
      icon: 'pi pi-fw pi-plus',
      routerLink: '/admin/products/create',
    },
    {
      label: 'Ver Produtos',
      icon: 'pi pi-fw pi-eye',
      routerLink: '/admin/view-products',
    },
  ];

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected cartService: CartService
  ) {}

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/entrar']);
  }
}

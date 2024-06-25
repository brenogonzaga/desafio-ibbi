import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { Product } from '@root/app/models/product';
import { CartService } from '@root/app/services/cart.service';
import { roundUSDPrice } from '@root/app/utils/roundUSDPrice';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  roundUSDPrice = roundUSDPrice;
  @Input() product: Product;
  value: any;
  note: string;

  constructor(protected cartService: CartService) {}
}

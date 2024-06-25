import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '@root/app/services/cart.service';
import { SaleService } from '@root/app/services/sale.service';
import { roundUSDPrice } from '@root/app/utils/roundUSDPrice';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ButtonModule,
    DataViewModule,
    CommonModule,
    TagModule,
    InputNumberModule,
    FormsModule,
    MenubarModule,
    RippleModule,
    InputTextareaModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  roundUSDPrice = roundUSDPrice;
  note: string;

  constructor(
    protected cartService: CartService,
    private salesService: SaleService
  ) {}

  ngOnInit(): void {}

  closeOrder(note: string) {
    const sale = {
      note,
      items: this.cartService.cart.map((cartItem) => {
        return {
          product_id: cartItem.product.id,
          quantity: cartItem.quantity,
        };
      }),
    };
    this.salesService.createSale(sale).subscribe((response) => {
    });
  }

  calculateTotal() {
    return this.cartService.cart.reduce((accumulator, cartItem) => {
      return accumulator + cartItem.product.price * cartItem.quantity;
    }, 0);
  }
}

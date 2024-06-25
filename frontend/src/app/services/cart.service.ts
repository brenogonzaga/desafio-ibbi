import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: CartItem[] = [];

  addProductToCart(product: Product, note: string) {
    if (this.cart.find((cart) => cart.product.id === product.id)) return;
    this.cart.push({ product, quantity: 1 });
  }

  removeProductFromCart(cartItem: CartItem) {
    this.cart = this.cart.filter(
      (cart) => cart.product.id !== cartItem.product.id
    );
  }
}

import { Component } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart-service.service';
import { ShoppingCartItem } from '../classes/shopping-cart-item';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  cartItems: ShoppingCartItem[] = [];
  cartPrice: number = 0;
  cartQuantity: number = 0;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {

    //достаем из сервиса корзину cardItems так как товары корзины будем отображать на странице нового компонента.
    this.cartItems = this.cartService.cartItems;

    // В новом компоненте товаров корзины тоже подписываемся на сумму и колличество так как они нужны нам на этой странице
    this.cartService.cartPrice.subscribe(
      data => this.cartPrice = data
    );

    this.cartService.cartQuantity.subscribe( 
      data => this.cartQuantity = data
    );

    this.cartService.сartPriceAndQuantityCompute();
  }

  incrementItemQuantity(theCartItem: ShoppingCartItem) {
    this.cartService.addToShoppingCart(theCartItem);
  }
  
  decrementItemQuantity(theCartItem: ShoppingCartItem) {
    this.cartService.decrementItemQuantity(theCartItem);
  }

  removeItem(theCartItem: ShoppingCartItem) {
    this.cartService.removeItem(theCartItem);
  }
}

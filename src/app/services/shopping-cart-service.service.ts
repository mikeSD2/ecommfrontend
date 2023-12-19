import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { ShoppingCartItem } from '../classes/shopping-cart-item';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ColorAmountOfItem } from '../classes/color-amount-of-order-item';

// !!!Товары в корзине теряються при перезагрузке страницы. Исправим это. Данные будем зранить либо в Session Storage
// (данные храняться в браузере пользователя) либо в Local Storage(данные храняться на компьютере пользователя).
// Session Storage. У каждой вкладки браузера свои отдельные данные в Session Storage, данные теряються при закрытии браузера.
// Local Storage. Данные в Local Storage доступны всем вкладкам браузера. Данные не теряються при закрытии браузера. 
// Данные разных сайтов и в случае с Local Storage и с Session Storage не доступны друг другу (тоесть данные сайта 
// somesite.com в Storage не доступны для сайта anothersite.net).
// И Local Storage и Session Storage хранят данные как ключ/значение где значение всегда string. 
// Данные корзины не нужны нам надолго поэтому воспользуемся Session Storage. 

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  cartItems: ShoppingCartItem[] = [];
  // Создвем обьект Storage. 
  storage: Storage = sessionStorage;
  cartPrice: Subject<number> = new BehaviorSubject<number>(0);
  cartQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { 
    // Если юзер обновит страницу то в конcтрукторе должна считываться корзина в Storage.  
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      // Если она не пуста то обновляем корзину.
      this.cartItems = data;
      // Обновляем сумму и колличество.
      this.сartPriceAndQuantityCompute();
    }
  }
  addToShoppingCart(theCartItem: ShoppingCartItem) {
    let existingCartItem: ShoppingCartItem | undefined;
    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find( singleCartItem =>singleCartItem.id === theCartItem.id );
    }

    if (existingCartItem) {
      existingCartItem.quantity!+=theCartItem.quantity!;
      let colorExist = existingCartItem.colors.find( singleColor =>singleColor.color === theCartItem.colors[0].color);
      if(colorExist) {
        colorExist.quantity! += theCartItem.quantity!;
      }
      else {
        theCartItem.colors[0].quantity!+=theCartItem.quantity!;
        existingCartItem.colors.push(theCartItem.colors[0]);
      }
    }
    else {
      this.cartItems.push(theCartItem);
    }
    this.сartPriceAndQuantityCompute()
  }
  сartPriceAndQuantityCompute(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity! * currentCartItem.itemPrice!;
      totalQuantityValue += currentCartItem.quantity!;
    }

    this.cartPrice.next(totalPriceValue);
    this.cartQuantity.next(totalQuantityValue);
    // В методе обновления суммы и колличества в конце добавим добавление корзины с товарами 
    // в Storage так как раз потребовалось обновление суммы и колличества значит было и обновление корзины и нам нужно
    // ее обновить и в Storage. 
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  decrementItemQuantity(theCartItem: ShoppingCartItem) {
    theCartItem.quantity!--;

    if (theCartItem.quantity === 0) {
      this.removeItem(theCartItem);
    }
    else {
      this.сartPriceAndQuantityCompute();
    }
  }

  removeItem(theCartItem: ShoppingCartItem) {

    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.сartPriceAndQuantityCompute();
    }
  }
}

// И Local Storage и Session Storage можно посмотреть в консоли там где логи.!!!!
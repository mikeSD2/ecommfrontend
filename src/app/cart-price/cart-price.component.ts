import { Component } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart-service.service';

@Component({
  selector: 'app-cart-price',
  templateUrl: './cart-price.component.html',
  styleUrls: ['./cart-price.component.css']
})
export class CartPriceComponent {
  cartPrice: number = 0.00;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    
    // Теперь в компоненте отображения суммы подписываемся на переменные сервиса которые рассылают значения. В этом компонентенужна только сумма
    // Теперь можно будет увидеть что когда происходит рассылка сервисом по нажатию юзером кнопки добавления товара происходит запись
    // в переменную в текущем компоненте которую может считать и показать html страница связанная с этим компонентом.
    this.cartService.cartPrice.subscribe(
      data => this.cartPrice = data
    );

  }

}
import { ProductCategory } from '../classes/product-category';
import { ProductSubcategory } from '../classes/product-subcategory';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { PurchaseHistoryService } from '../services/purchase-history.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  productCategories: ProductCategory[] = [];

  storage: Storage = sessionStorage;
  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(private router: Router, private productService: ProductService,
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private purchaseHistoryService: PurchaseHistoryService) { }

  ngOnInit() {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
    this.listProductCategoriesAndSubc();
  }

  listProductCategoriesAndSubc() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
        for(let singleProductCategory of this.productCategories){
          this.productService.getProductSubcategoriesByCatId(singleProductCategory.id).subscribe(
            data => {
              singleProductCategory.productsubcategories = data;
            }
          );
        }
      }
    );
  }

  doSearch(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }
  
  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
          
          // Работать выборка истории покупок будет так: в navbar классе по ngOnInit проискодит выборка имейла 
          // okta аккаунта пользователя res.email -> и передаеться в метод setUserAccountEmail определенный нами 
          // в сервисе HistoryService -> в этом методе происходит рассылка Subject переменной имейла переданного в setUserAccountEmail
          // -> в классе компонента где будет отображаться история, в ngOnInit будет происходить subscribe на эту Subject переменную
          // в сервисе -> как только через Subject переменную будет передан имейл класс компонента истории сабскрайбом получает его.
          // -> и происходит отправка имейла на сервер для получения истории по нему. 
          // Таким образом когда загрузился компонент navbar он будет передавать имейл компоненту истории покупок
          // и этот компонент будет запрашивать у бекенда историю заказов пользователя по этому имейлу.
          // Без Subject переменной здесь ясное дело не обойтись так как если мы вместо нее будем пользоваться простой стринг 
          // переменной в сервисе для хранения имейла то есть риск что navbar загрузится позже чем компонент истории покупок, 
          // а это значит что компонент истории отправит на бекенд пустоту вместо имейла так как имейл еще не был записан
          // в переменную в сервисе така как navbar еще не звгрузился. 
          // Здесь так подробно просто чтобы напомнить механизм Subject лишним не будет)
          // Кстати также еще можно было воспользоваться Storage и хранить в нем имейл эффект был бы тот же самый.

          // извлечем имейл и передадим его в метод который рассылает этот имейл
          this.purchaseHistoryService.setUserAccountEmail(res.email as string);
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}

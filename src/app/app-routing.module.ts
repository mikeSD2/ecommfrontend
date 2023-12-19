import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import OktaAuth from '@okta/okta-auth-js';

function goToLogin(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);
  router.navigate(['/login']);
}

// !!!Теперь добавим кнопку на navbar которая будетдоступна только аутентифицированым пользователям
// и которая ведет к странице истории покупок.

const routes: Routes = [
  // Angular есть специальные Route Guards. Работает так: если пользователь вошел в учетную запись то можно перейти 
  // по данному route если нет то нельзя.

  //   Вот пример. Если пользователь авторизирован то по данному пути можно перейти если нет то происходи переход на 
  // страницу для входа. goToLogin это функция которую мы должны определить здесь в рлутинг модуле. Она перенаправляет
  // нас на страницу логина. С помощью Injector (с помощью негоможно получить доступ к любому сервису приложения) 
  // извлекаем router. Для того чтобы перейти с помощью него на нужную страницу.
    {path: 'history', component: PurchaseHistoryComponent, canActivate: [OktaAuthGuard],
                    data: {onAuthRequired: goToLogin} },
    {path:'login/callback',component: OktaCallbackComponent},
    {path:'login', component: LoginComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'cart-details', component: ShoppingCartComponent},
    {path: 'products/:id', component: ProductDetailsComponent},
    {path: 'search/:name', component: ProductsComponent},
    {path: 'category/:id', component: ProductsComponent},
    {path: 'subcategory/:id', component: ProductsComponent},
    {path: 'category', component: ProductsComponent},
    {path: 'products', component: ProductsComponent},
    {path: '', redirectTo: '/products', pathMatch: 'full'},
    {path: '**', redirectTo: '/products', pathMatch: 'full'}
  ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

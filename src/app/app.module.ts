import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartPriceComponent } from './cart-price/cart-price.component';
import { ReactiveFormsModule } from '@angular/forms'
// Здесь в модуле импортируем все что нужно из Okta.
import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG 
} from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from './config/application-config';
import { AuthenticationInterceptorService } from './services/authentication-interceptor.service';
import { UserAttributesProviderService } from './services/user-attributes-provider.service';
import { OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NavbarComponent,
    ProductDetailsComponent,
    PurchaseHistoryComponent,
    ShoppingCartComponent,
    LoginComponent,
    FooterComponent,
    CheckoutComponent,
    CartPriceComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule,
    OAuthModule.forRoot()
  ],
  // И передаем обьект OktaAuth в providers и этот настроеный обьект мы внедряли OktaAuth в классах
  providers: [ProductService, { provide: OKTA_CONFIG, useValue: { oktaAuth }},
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
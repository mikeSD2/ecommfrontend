import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// сервис для отправки id на бек и получения ответа
export class UserAttributesProviderService {
  // ссылка для по которой отправляеться id
  public PRODUCTSRATEDSTATES_API = 'https://ecommercebackend-delicate-fire-9123.fly.dev/eCommerceApi/productsRatedStates';
  // импортируем необходимые сервисы
  constructor(private http: HttpClient, private oauthService: OAuthService) {
  }

  // этот метод будет добавлять заголовок в запрос к беку. В нем будет отправляться некоторые данные пользователя
  // используя которые бекенд сможет добавлять и удалять данные из okta аккаунта пользователя.
  getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader())
  }
  // метод для отправки id. здесь все знакомо только добавляем еще заголовок.
  saveHoldings(productId: number): Observable<any> {
    let addStateUrl = this.PRODUCTSRATEDSTATES_API + '/addProductState';
    return this.http.post(addStateUrl, productId,{headers: this.getHeaders()});
  }
  // Далее рассмотрим Бекенд.

  // не нужен
  getHoldings(productId: number): Observable<any> {
    let getStatesUrl = this.PRODUCTSRATEDSTATES_API + '/getStateById';
    return this.http.post(getStatesUrl,productId,{headers: this.getHeaders()});
  }
}

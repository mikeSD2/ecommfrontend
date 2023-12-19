import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, Subject } from 'rxjs';
import { PurchaseHistory } from '../classes/purchase-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseHistoryService {
  userAccEmail: Subject<string> = new BehaviorSubject<string>('');
  // Импортируем environment и добавляем из него переменную с началом ссылки в начало ссылки.
  private orderUrl = environment.appBaseUrl + '/orders'; 
  constructor(private httpClient: HttpClient) { }
  getPurchaseHistory(email: string, sortByValue: string): Observable<PurchaseHistory[]> {
    const purchaseHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderBy${sortByValue}?email=${email}`;
    return this.httpClient.get<GetResponsePurchaseHistory>(purchaseHistoryUrl).pipe(
      map(response => response._embedded.orders)
    );
  }
  setUserAccountEmail(email: string) {
    this.userAccEmail.next(email);
  }
}

interface GetResponsePurchaseHistory {
  _embedded: {
    orders: PurchaseHistory[];
  }
}

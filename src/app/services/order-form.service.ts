import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../classes/country';
import { Region } from '../classes/region';
import { environment } from 'src/environments/environment';
// Создаем сервис для компонента формы FormSrvice назовем.
@Injectable({
  providedIn: 'root'
})
export class OrderFormService {
// Импортируем environment и добавляем из него переменную с началом ссылки в начало ссылки.
  private baseURL = environment.appBaseUrl;

  constructor(private httpClient: HttpClient) { }
  // Здесь уже известным нам образом создаем методы для
  // выборки стран и штатов по ссылкам
  // localhost:8080/eCommerceApi/countries
  // localhost:8080/eCommerceApi/states/search/findByCountryCode?code=UA
  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(`${this.baseURL}/countries`).pipe(
      map(response => response._embedded.countries)
    );
  }

  getRegions(countryName: string): Observable<Region[]> {

    // search url
    const searchStatesUrl = `${this.baseURL}/regions/search/findByCountryName?name=${countryName}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.regions)
    );
  }
}
// и создаем интерфейсы к ним.
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    regions: Region[];
  }
}
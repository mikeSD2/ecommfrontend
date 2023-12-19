import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Product } from '../classes/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../classes/product-category';
import { ProductSubcategory } from '../classes/product-subcategory';
import { ColorAmountInStocks } from '../classes/color-amount-in-stocks';
import { ProductDetailsImages } from '../classes/product-details-images';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.appBaseUrl + '/products';

  private justBaseUrl = environment.appBaseUrl;

  constructor(private httpClient: HttpClient) { }
  getProductList(categoryId: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}${categoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  
  searchProducts(theName: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theName}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const searchUrl = `${this.justBaseUrl}/productCategories`;
    return this.httpClient.get<GetResponseProductCategory>(searchUrl).pipe(
      map(response => response._embedded.productCategories)
    );
  }

  getProductSubcategoriesByCatId(categoryId: number): Observable<ProductSubcategory[]> {
      const searchUrl = `${this.justBaseUrl}/productCategories/${categoryId}/productsubcategories`;
    return this.httpClient.get<GetResponseProductSubcategory>(searchUrl).pipe(
      map(response => response._embedded.productSubcategories)
    );
  }
  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
  getProductColorsById(categoryId: number): Observable<ColorAmountInStocks[]> {
    const searchUrl = `${this.justBaseUrl}/products/${categoryId}/colors`;
    return this.httpClient.get<GetResponseProductColors>(searchUrl).pipe(
      map(response => response._embedded.colorAmountInStocks)
    );
  }
  getProductImagesById(categoryId: number): Observable<ProductDetailsImages[]> {
    const searchUrl = `${this.justBaseUrl}/products/${categoryId}/images`;
    return this.httpClient.get<GetResponseProductImages>(searchUrl).pipe(
      map(response => response._embedded.productDetailsImageses)
    );
  }
  //модифицируем метод получения продуктов по ключевому слову который вбил пользователь в строке поиска.
  searchProductsPaginate(thePage: number, 
    thePageSize: number, 
    theKeyword: string,
    sortByValue: string): Observable<GetResponseProducts> {
    // как видим ниже вставляем строку кроторую мы обьединили в классе компонента из переменных
    // и передали сюда и вставляем ее в ссылку таким образом получиться findByNameContainingOrderByDateCreatedDesc
    // если была передана строка передан DateCreatedDesc
    const searchUrl = `${this.baseUrl}/search/findByNameContainingOrderBy${sortByValue}?name=${theKeyword}`
    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  //модифицируем метод получения продуктов просто при открытии главной страницы или покатегории или по подкатегории.
  //здесь отсортируем продукты другим образом чем выше. С помощью специальных параметров в ссылке.
  //Например можно отсортировать продукты таким образом 
  //https://localhost:8080/eCommerceApi/products/search/findBySubcategoryCategoryId?id=2&page=0&size=15&sort=DateCreated,Desc
  //тоесть видим в конце специальным параметром sort сортируються продукты по DateCreated с напрвлением Desc
  getProductListPaginate(thePage: number, 
    thePageSize: number, 
    theCategoryId: string,
    sortByValue: string,
    sortByDir: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}${theCategoryId}`
    + `&page=${thePage}&size=${thePageSize}&sort=${sortByValue},${sortByDir}`; //вставляем в ссылку атрибут по которому сортируем и направление
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  changeRating(productWithNewRating: Product): Observable<any> {
    const productChangeUrl = `${this.justBaseUrl}/productChange/changeRating`;
    return this.httpClient.post<Product>(productChangeUrl, productWithNewRating);    
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategories: ProductCategory[];
  }
}

interface GetResponseProductSubcategory {
  _embedded: {
    productSubcategories: ProductSubcategory[];
  }
}
//новые интерфейсы
interface GetResponseProductColors {
  _embedded: {
    colorAmountInStocks: ColorAmountInStocks[];
  }
}

interface GetResponseProductImages {
  _embedded: {
    productDetailsImageses: ProductDetailsImages[];
  }
}
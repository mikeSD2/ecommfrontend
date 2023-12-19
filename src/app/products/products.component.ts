import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/classes/product';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartItem } from '../classes/shopping-cart-item';
import { ShoppingCartService } from '../services/shopping-cart-service.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  currentRouteAndCategoryId!: string;
  products: Product[] = [];
  thePageNumber: number = 1;
  thePageSize: number = 15;
  theTotalElements: number = 0;
  previousRouteAndCategoryId!: string;
  previousName: string = "";

  // в sortByValue в виде строки будет храниться имя аттребута в таблице продукта по которому будет производиться сортировка продуктов
  // в sortByDir в виде строки будет храниться направление по каоторому производиться сортировка
  sortByValue: string = '';
  sortByDir: string = '';
  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: ShoppingCartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      // по умолчанию установим сортировку продуктов по DateCreated в порядке от самого нового к старому в БД.
      this.sortByValue = "DateCreated"; 
      this.sortByDir = "Desc";
      this.listProducts();//в listProducts эти переменные будут использоваться увидеш ниже как
    });
  }
  //вот тот метод который вызываеться по изменению селекта.
  onSelectChange (val: any) {
    //val это тот обьект в котором информация о событии
    if(val.target.value==1) {//проверяем значение селекта в этом обьекте
      //и вбиваем в sortByValue и sortByDir соответствующие выбранному пользователем селекту значения
      this.sortByValue = "DateCreated"; 
      this.sortByDir = "Desc";
    }//дальше подобным образом если другие значения селекта
    else if (val.target.value==2) {
      this.sortByValue = "Rating"; 
      this.sortByDir = "Asc";
    }
    else if (val.target.value==3) {
      this.sortByValue = "UnitPrice"; 
      this.sortByDir = "Desc";
    }
    else if (val.target.value==4) {
      this.sortByValue = "UnitPrice"; 
      this.sortByDir = "Asc";
    }
    this.listProducts();//в listProducts эти переменные будут использоваться увидеш ниже как
  }

  listProducts() {
    console.log(this.sortByValue);
    if (this.route.snapshot.paramMap.has('name')) {
      const theName: string = this.route.snapshot.paramMap.get('name')!;
      if (this.previousName != theName) {
        this.thePageNumber = 1;
      }
      
      this.previousName = theName;

      this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                 this.thePageSize,
                                                 theName,//ниже переменные для сортировки обьединяються в одну строку
                                                  // и передаються в метод для выборки по слову в строке поиска на сайте.
                                                  // в сервисе увидите зачем
                                                 `${this.sortByValue}${this.sortByDir}`).subscribe((data: any) => {
                                                      this.products = data._embedded.products;
                                                      this.thePageNumber = data.page.number + 1;
                                                      this.thePageSize = data.page.size;
                                                      this.theTotalElements = data.page.totalElements;
                                                    })
    }
    else {
      if (this.route.snapshot.paramMap.has('id')) {

        if(this.route.routeConfig?.path=="subcategory/:id") {
          this.currentRouteAndCategoryId = `/search/findBySubcategoryId?id=${this.route.snapshot.paramMap.get('id')}`;
        }
        else {
          this.currentRouteAndCategoryId = `/search/findBySubcategoryCategoryId?id=${this.route.snapshot.paramMap.get('id')}`;
        }
      }
      else {
        this.currentRouteAndCategoryId = `?`;
      }

      if (this.previousRouteAndCategoryId != this.currentRouteAndCategoryId) {
        this.thePageNumber = 1;
      }

      this.previousRouteAndCategoryId = this.currentRouteAndCategoryId;

      this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.currentRouteAndCategoryId,
                                                //также здесть передаем эти значания в метод для выборки продуктов
                                                this.sortByValue,
                                                this.sortByDir)
                                                .subscribe((data: any) => {
                                                        this.products = data._embedded.products;
                                                        this.thePageNumber = data.page.number + 1;
                                                        this.thePageSize = data.page.size;
                                                        this.theTotalElements = data.page.totalElements;
                                                      })
    }
  }
  addToShoppingCart(theProduct: Product) {
    this.productService.getProductColorsById(theProduct.id!).subscribe(
      data => {
        let theCartItem = new ShoppingCartItem(); 
        theCartItem.setItem(theProduct);
        theCartItem.setColor(data[0].color!);
        this.cartService.addToShoppingCart(theCartItem);
      }
    )
  }
}

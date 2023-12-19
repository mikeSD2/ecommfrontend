import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../classes/product';
import { ShoppingCartService } from '../services/shopping-cart-service.service';
import { ShoppingCartItem } from '../classes/shopping-cart-item';
import { ColorAmountInStocks } from '../classes/color-amount-in-stocks';
import { UserAttributesProviderService } from '../services/user-attributes-provider.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product = new Product();
  priductColors?: ColorAmountInStocks[];
  theCartItem = new ShoppingCartItem();
  starsRating: number = 0;
  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: ShoppingCartService,
              private userAttributesProviderService: UserAttributesProviderService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  changeProductRating() {
    this.userAttributesProviderService.saveHoldings(this.product.id!).subscribe({
      next: data => {
        if(data==true) {
          this.starsRating = (this.product.rating!*this.product.ratingsAmount!+this.starsRating)/(this.product.ratingsAmount!+1);
          this.product.rating = this.starsRating;
          this.product.ratingsAmount = this.product.ratingsAmount!+1;
          this.productService.changeRating(this.product).subscribe({
            next: data => {
              console.log(data);
            }
          });
        }
      }
    });
  }

  handleProductDetails() {

    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
        console.log(this.product);
        this.starsRating = this.product.rating!;
        this.theCartItem.setItem(this.product);
      }
    )
    this.productService.getProductColorsById(theProductId).subscribe(
      data => {
        this.priductColors = data;
      }
    )
    this.productService.getProductImagesById(theProductId).subscribe(
      data => {
        this.product.priductImages = data;
        console.log(this.product.priductImages);
      }
    )
  }
  setColor(productColor: string) {
    this.theCartItem.setColor(productColor);
  }
  decrementItemQuantity(){
    this.theCartItem.quantity!--;
  }
  incrementItemQuantity(){
    this.theCartItem.quantity!++;
  }
  addToShoppingCart() {
    this.cartService.addToShoppingCart(this.theCartItem);
  }
}
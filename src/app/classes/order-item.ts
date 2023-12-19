import { ColorAmountOfItem } from "./color-amount-of-order-item";
import { ShoppingCartItem } from "./shopping-cart-item";

export class OrderItem {
    imageUrl?: string;
    itemPrice?: number;
    quantity?: number;
    productId?: number;
    colors: ColorAmountOfItem[] = [];

    constructor(cartItem: ShoppingCartItem) {
        this.imageUrl = cartItem.imageUrl;
        this.itemPrice = cartItem.itemPrice;
        this.productId = cartItem.id;
        this.quantity = cartItem.quantity;
        this.colors = cartItem.colors;
    }
}
/*{"customer":{
    "firstName":"htrethe",
    "lastName":"rthehrthytry",
    "phoneNumber":"+319701051846",
    "email":"mikeshadrin3@gmail.com"},
 "address":{
    "street":"La Guardiaweg 59",
    "city":"Amsterdam",
    "region":"Friesland",
    "country":"Netherlands",
    "zipCode":"1043 DE"},
 "order":{
    "itemsPrice":1189.93,
    "itemsQuantity":6},
 "orderItems":[{
    "colors":[{
        "color":"red",
        "quantity":2}],
    "imageUrl":"assets/img/products/clothes/placeholder.png",
    "itemPrice":79.99,
    "productId":2,
    "quantity":2
    },
    {"colors":[{
        "color":"red","quantity":1}],
    "imageUrl":"assets/img/products/clothes/placeholder.png",
    "itemPrice":129.98,
    "productId":1,
    "quantity":1
    },
    {"colors":[{
        "color":"red","quantity":3}],
    "imageUrl":"assets/img/products/clothes/placeholder.png",
    "itemPrice":299.99,
    "productId":4,
    "quantity":3
    }]
}*/
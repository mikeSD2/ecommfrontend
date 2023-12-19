
import { ColorAmountOfItem } from './color-amount-of-order-item';
import { Product } from './product';
export class ShoppingCartItem {

    id?: number;
    name?: string;
    itemPrice?: number;
    quantity?: number;
    imageUrl?: string;
    //здесь храняться цвета и колличества такого цвета этого товара.
    colors: ColorAmountOfItem[] = [];

    setItem(product: Product) {
        this.id = product?.id;
        this.name = product?.name;
        this.itemPrice = product?.unitPrice;
        this.quantity = 1;
        this.imageUrl = product?.imageUrl;
        //при заполнении товара который будет добавляться в корзину обьектом product
        //нужно также создать обьект в котором будет храниться цвет этого товара
        //и этот цвет меняеться в компоненте деталей товара методом setColor
        this.colors[0] = new ColorAmountOfItem();
        //если пользователь нажал добавить в корзину на главной странице с товарами, а не на странице деталей товара 
        //то будет добавляться первый цвет из извлеченных ранее.
    }
    public setColor(color: string):void {
        this.colors[0].color = color;
    }
}

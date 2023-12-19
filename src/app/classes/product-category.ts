import { ProductSubcategory } from "./product-subcategory";
//создадим класс в котором будут храниться категории и подкатегории
export class ProductCategory {
    constructor(public id: number,
        public categoryName: string,
        public productsubcategories: ProductSubcategory[]) {
    }
}

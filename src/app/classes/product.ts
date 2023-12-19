import { ColorAmountInStocks } from "./color-amount-in-stocks";
import { ProductDetailsImages } from "./product-details-images";

export class Product {

    constructor(public id?: number,
                public name?: string,
                public unitPrice?: number,
                public description?: string,
                public additionalInfo?: string,
                public rating?: number,
                public ratingsAmount?: number,
                public imageUrl?: string,
                public active?: boolean,
                public unitsInStock?: number,
                public dateCreated?: Date,
                public lastUpdated?: Date,
                public priductImages?: ProductDetailsImages[],
        ) {
    }
}

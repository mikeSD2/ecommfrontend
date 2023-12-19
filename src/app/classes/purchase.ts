import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";
//Теперь на фронте создаем класс товара, покупателя и собственно класс Purchase для отправки. 
export class Purchase {
    customer?: Customer;
    address?: Address;
    order?: Order;
    orderItems?: OrderItem[]; 
}

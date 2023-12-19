import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { OrderFormService } from '../services/order-form.service';
import { Country } from '../classes/country';
import { Region } from '../classes/region';
import { MycustomWhitespaseValidators } from '../validators/mycustom-whitespase-validators';
import { ShoppingCartService } from '../services/shopping-cart-service.service';
import { ShoppingCartItem } from '../classes/shopping-cart-item';
import { CheckoutService } from '../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../classes/order';
import { OrderItem } from '../classes/order-item';
import { Purchase } from '../classes/purchase';
import { PurchaseHistoryService } from '../services/purchase-history.service';

// !!!Добавим в компонент офромления заказа форму для ввода данных банковской карты для перевода платежа. 
// Во первых нам нужен Обработчик платежей. Все слышали про paypal. Его мы и будем использовать. Обработчик нужен 
// так как покупатели должны иметь возможность расплатиться с любых банков. Тоесть обработчик платежа нужен чтобы 
// соединиться со всеми возможными банками для обеспечения платежа через одну форму. Обработчик платежа это шлюз 
// который дает возможность отправки платежа с любого банка на любой другой банк. 
// Также обработчик отвечаетза безопасную пересылку средств и сообщает поккпателю был ли принят платеж банком или нет.
// Довольно важный момент по поводу безопасности платежей. Введенные пользователем данные карты НИКОГДА не должны 
// присылаться на сайт на котором он совершает платеж и уж тем более храниться на серверах этого сайта. Данные 
// пользователя должны напрямую отсылаться в банк через хорошо защищенный обработчик платежей тогда гарантированно
// с данными ничего опасного не случиться. 


// чтобы получить доступ к качанному paypal sdk просто обьявляеться глобальная переменная
// через эту переменную будем настраивать обработку платежа.
declare var paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartPrice: number = 0;
  cartQuantity: number = 0;
  shoppingCartItems: ShoppingCartItem[] = [];
  
  countries: Country[] = [];
  regions: Region[] = [];

  checkoutFormGroup!: FormGroup;

  // это новая аннотация. С помощью нее можно получиить доступ к html элементу на странице
  // и совершать различные операции с ним получить его сожержимое например и другое. 
  // здесь береться html элемент на странице помеченный #paypal
  // и этот html элемент записываеться в paypalHtmlElement.
  // Далее в этот html элемент через переменную paypalHtmlElement будeт монтироваться PayPal кнопка
  @ViewChild('paypal',{static: true})
  paypalHtmlElement: ElementRef | undefined;

  // Также береться html элемент на странице помеченный #checkoutForm
  // и этот html элемент записываеться в checkoutForm.
  // Через checkoutForm будем программно делать Submit формы вместо понажатию на кнопку как раньше.
  @ViewChild('checkoutForm') 
  checkoutForm: ElementRef | undefined;
  
  constructor(private formBuilder: FormBuilder,
              private orderFormService: OrderFormService,
              private shoppingCartService: ShoppingCartService,
              private checkoutService: CheckoutService,
              private router: Router,
              private purchaseHistoryService: PurchaseHistoryService) { }

  ngOnInit(): void {
    this.purchaseHistoryService.userAccEmail.subscribe(
      dataEmail => {
        this.checkoutFormGroup = this.formBuilder.group({
          customer: this.formBuilder.group({
            firstName: new FormControl('', [Validators.required, 
                                          Validators.minLength(2), 
                                          MycustomWhitespaseValidators.notOnlyWhitespace]),
            lastName: new FormControl('', [Validators.required, 
                                            Validators.minLength(2), 
                                            MycustomWhitespaseValidators.notOnlyWhitespace]),
            phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")]),
            email: new FormControl(dataEmail, [Validators.required, Validators.email])
          }),
          address: this.formBuilder.group({
            street: new FormControl('', [Validators.required, 
              Validators.minLength(2), 
              MycustomWhitespaseValidators.notOnlyWhitespace]),
            city: new FormControl('', [Validators.required, 
              Validators.minLength(2), 
              MycustomWhitespaseValidators.notOnlyWhitespace]),
            region: new FormControl('', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            zipCode: new FormControl('', [Validators.required, 
              Validators.minLength(2), 
              MycustomWhitespaseValidators.notOnlyWhitespace]),
          }),
          someOrderInfo: this.formBuilder.group({
            orderNotes: new FormControl('', [Validators.minLength(15)]),
            noteByEmail: [true]
          })
        });    
      }
    );

    this.orderFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );
    this.shoppingCartService.cartQuantity.subscribe(
      data => {this.cartQuantity = data}
    );

    this.shoppingCartService.cartPrice.subscribe(
      data => {this.cartPrice = data}
    );
    this.shoppingCartItems = this.shoppingCartService.cartItems;
    
    // Стоит уточнить что форма для ввода данных кредитной карты у нас будет не на саймой checkout странице, на checkout странице будет
    // кнопка по нажатию на которую будет открываться отдельное окно в котором пользователь может зайти в свой аккаунт paypal,
    // и заплатить.
    // Процесс платежа происходит таким образом: когда пользователь нажимает на кнопку которая открывает отдельное окно для офромления
    // платежа, на сайт paypal должны отправиться некоторые данные о платеже. Эти данные могут быть разными но минимум этих данных 
    // это валюта, и сумма платежа. PayPal проверяет все ли в порядке с этими данными правильную ли ввели валюту и сумму. Если 
    // да то в открывшемся окне для оформления заказа будут отображены самма которую пользователь собираеться заплатить и валюта
    // также могут быть другие данные но пока как говорили минимум. И ясное дело появляеться форма для ввода данных банковской карты.
    // Теперь когда пользователь жмет заплатить снимаються деньги с карты и если не было никаких ошибок выполняються действия 
    // которые выполнялись ранее тоесть сохраниение заказа на бекенде в БД.

    // Дла тестирования платежа paypal предоставляет нам два тестовых аккаунта: personal account через который 
    // бедет совершаться платеж тоесть с которого будут сниматься деньги и business account на который будут они приходить.
    // Зайдем в наш developer.paypal.com аккаунт там где мы брали id. Перейдем testing tools > sendbox accounts.
    // Здесь можно увидеть эти два аккаунта. в них можно зайти через sandbox.paypal.com и посмотреть отправленные и
    // пришедшие платежи. Кстате когда производим платеж мы входим в тестовый personal account и через него платим.

    // серез функцию Buttons настраиваем наши кнопки которые будут добавляться на страницу.
    paypal.Buttons({
      //createOrder для отправки данных которые будет проверять paypal
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
              // минимум данных для проверки пейпалом
              // это валюта, и сумма платежа.
              amount: {
                  value: this.cartPrice,
                  currency_code: 'USD' 
              },
              // дополнительно для примера добавим описание платежа. 
              // Его можно будет увидеть в тестовом бизнесс аккаунте 
              // при просмотре деталей пришедшего платежа.
              description: 'Your order description'
          }]
        });
      },
      // здесь происходит сам платеж
      onApprove: (data, actions) => {
        const order = actions.order.capture()// capture - совершить платеж
        .then((details) => {
        // из details можем извеч детали платежа
        // и если он прошел успешно
        if (details["status"] == "COMPLETED") {
          // делаем сабмит нашей формы программно как уже указывалось ранее
          this.checkoutForm?.nativeElement.submit();
          // вызываем функцию this.placeOrder(). 
          this.placeOrder();
          // она просто отправляет данные формы и заказа на бекенд
          // тоесть то же что и раньше.
        }
        })
      },
      // при ошибке сообщение.
      onError: (err) => {
        alert(`Error: ${err.message}`);
      }
    })
    .render(this.paypalHtmlElement?.nativeElement)// с помощью render монтируем настроенные кнопки в html элемент в paypalHtmlElement
  }

  getRegions() {
    const formGroup = this.checkoutFormGroup.get("address");
    const countryName = formGroup!.value.country.name;
    this.orderFormService.getRegions(countryName).subscribe(
      data => {
          this.regions = data;
        formGroup!.get('region')!.setValue(data[0]);
      }
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get phoneNumber() { return this.checkoutFormGroup.get('customer.phoneNumber'); }

  get addressStreet() { return this.checkoutFormGroup.get('address.street'); }
  get addressCity() { return this.checkoutFormGroup.get('address.city'); }
  get addressRegion() { return this.checkoutFormGroup.get('address.region'); }
  get addressZipCode() { return this.checkoutFormGroup.get('address.zipCode'); }
  get addressCountry() { return this.checkoutFormGroup.get('address.country'); }

  get orderNotes() { return this.checkoutFormGroup.get('someOrderInfo.orderNotes'); }
  
  placeOrder() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let purchase = new Purchase();
        
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.address = this.checkoutFormGroup.controls['address'].value;
    const country: Country = JSON.parse(JSON.stringify(purchase.address?.country));
    const region: Region = JSON.parse(JSON.stringify(purchase.address?.region));
    purchase.address!.country = country.name;
    purchase.address!.region = region.name;
    let order = new Order();
    order.itemsPrice = this.cartPrice;
    order.itemsQuantity = this.cartQuantity;
    order.noteByEmail = this.checkoutFormGroup.get('someOrderInfo')?.value.noteByEmail;
    order.orderNotes = this.checkoutFormGroup.get('someOrderInfo')?.value.orderNotes;

    let orderItems: OrderItem[] = [];
    for (let i=0; i < this.shoppingCartService.cartItems.length; i++) {
      orderItems[i] = new OrderItem(this.shoppingCartService.cartItems[i]);
    }
  
    purchase.order = order;
    purchase.orderItems = orderItems;
    this.checkoutService.placeOrder(purchase).subscribe({
        next: data => {
          alert(`Order is received.\nTracking number of order: ${data.trackingNumber}`);

          this.shoppingCartService.cartItems = [];
          this.shoppingCartService.cartPrice.next(0);
          this.shoppingCartService.cartQuantity.next(0);
          // Также конечно необходимо очистить корзину которая храниться в Storage.
          this.shoppingCartService.storage.setItem('cartItems', JSON.stringify(this.shoppingCartService.cartItems));
          this.checkoutFormGroup.reset();

          this.router.navigateByUrl("/products");
        },
        error: error => {
          alert(`Error: ${error.message}`);
        }
      }
    );
  }
}

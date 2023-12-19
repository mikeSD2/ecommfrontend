import { Component, OnInit } from '@angular/core';
import { PurchaseHistory } from '../classes/purchase-history';
import { PurchaseHistoryService } from '../services/purchase-history.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {

  purchaseHistoryList: PurchaseHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private purchaseHistoryService: PurchaseHistoryService) { }

  ngOnInit(): void {
    this.handlePurchaseHistory("DateCreatedDesc");
  }

  onSelectChange (val: any) {
    if(val.target.value==1) {
      this.handlePurchaseHistory("DateCreatedDesc");
    }
    else if (val.target.value==2) {
      this.handlePurchaseHistory("DateCreatedAsc");
    }
    else if (val.target.value==3) {
      this.handlePurchaseHistory("ItemsPriceDesc");
    }
  }

  handlePurchaseHistory(sortByValue: string) {

    // подписываемся на Subject
    this.purchaseHistoryService.userAccEmail.subscribe(
      emailData => {
        // когда subject прислал имейл передаем его в метод getPurchaseHistory для получения заказов пользователя
        this.purchaseHistoryService.getPurchaseHistory(emailData, sortByValue).subscribe(
          historyData => {
            this.purchaseHistoryList = historyData;
          }
        );
      }
    );
  }

}

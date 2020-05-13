import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, ViewRef } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { PurchaseService } from '../../../../services/purchase.service';
import { EventsService } from '../../../../services/events.service';
import { finalize } from 'rxjs/operators';
import { Events } from '../../../../services/events';

@Component({
  selector: 'purchase-list-component',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
})
export class PurchaseListComponent implements OnInit {

  @Input() status: any;
  @Input() purchase: any;
  @Input() page: string;
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  isLoading: boolean = true;
  nextUrl: string | null;
  itemData: any;
  itemList: any | null;
  statusArray: any;

  generalStatus: any = ['submitted', 'draft', 'reviewed', 'assigned', 'processed'];
  historyStatus: any = ['done', 'rejected'];

  constructor(
    private cd: ChangeDetectorRef,
    private purchaseService: PurchaseService,
    private events: Events
  ) { }

  ngOnInit() {
    this.statusArray = this.status.split(',');
    this.getItems();

    this.events.subscribe('purchase:create', (data: any) => {
      this.purchase = data.item;
      this.itemList.unshift(this.purchase);
    });

    // Update
    this.events.subscribe('purchase:update', (data: any) => {
      var index = this.itemList.findIndex((d: any) => {
        return d.uuid == data.item.uuid
      });

      this.itemList[index] = data.item;
    });

    // Delete
    this.events.subscribe('purchase:delete', (data: any) => {
      this.itemList = this.itemList.filter((d: any) => d.uuid !== data.item.uuid);

      if (this.statusArray.includes(data.item.status)) {
        this.itemData.count = (this.itemData.count > 0 ? this.itemData.count - 1 : 0);
      }

      setTimeout(() => {
        if (this.cd && !(this.cd as ViewRef).destroyed) {
          this.cd.detectChanges();
        }
      });
    });

    this.events.subscribe('purchase:refresh', (data: any) => {
      this.getItems(false, true);
    });

  }

  getItems(isMore: boolean = false, isRefresh: boolean = false): void {
    if (isMore) this.isLoading = false;

    let url = this.nextUrl;
    if  (isRefresh) {
      url = null;
      this.isLoading = true;
    }

    this.purchaseService.getPurchases({'status': this.status.replace(/\s/g, ''), 'next_url': url })
      .pipe(
        finalize(() => {
          if (!isMore) this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.itemData = response;
          this.nextUrl = this.itemData.navigate.next;

          if (isMore && this.itemData.results) {
            this.itemList = this.itemList.concat(this.itemData.results);
          } else {
            this.itemList = this.itemData.results;
          }
        },
        (failure: any) => {

        }
      )
  }

  loadMore(event: any) {
    if (!event.target.disabled) this.getItems(true);
  
    setTimeout(() => {
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (!this.nextUrl) {
        event.target.disabled = true;
      }
    }, 500);
  }

  ngOnDestroy() {
    this.events.unsubscribe('purchase:create');
    this.events.unsubscribe('purchase:update');
    this.events.unsubscribe('purchase:delete');
    this.events.unsubscribe('purchase:refresh');
  }

}

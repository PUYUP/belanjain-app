import { Component, OnInit, Input, ChangeDetectorRef, ViewRef } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { NecessaryService } from '../../../../services/necessary.service';
import { EventsService } from '../../../../services/events.service';
import { Events } from '../../../../services/events';

@Component({
  selector: 'necessary-list-component',
  templateUrl: './necessary-list.component.html',
  styleUrls: ['./necessary-list.component.scss'],
})
export class NecessaryListComponent implements OnInit {

  @Input() purchase: any;

  isLoading: boolean = true;
  itemData: any;
  itemList: any | null;
  status = ['accept', 'processed', 'done'];
  nextUrl: string;

  constructor(
    private cd: ChangeDetectorRef,
    private necessaryService: NecessaryService,
    private events: Events
  ) { }

  ngOnInit() {
    this.getItems();
    this.events.subscribe('necessary:create', (data: any) => {
      if (data.item) {
        this.itemList.unshift(data.item);
        this.itemData.count = 1 + this.itemData.count;
      }
    });

    // Update
    this.events.subscribe('necessary:update', (data: any) => {
      if (data.item) {
        var index = this.itemList.findIndex((d: any) => {
          return d.uuid == data.item.uuid
        });
  
        this.itemList[index] = data.item;
      }
    });

    // Delete
    this.events.subscribe('necessary:delete', (data: any) => {
      if (data.item) {
        this.itemList = this.itemList.filter((d: any) => d.uuid !== data.item.uuid);
        this.itemData.count = this.itemData.count - 1;

        setTimeout(() => { 
          this.cd.detectChanges();
        }, 200);

        if (this.itemData.count == 0) this.events.unsubscribe('necessary:delete');
      }
    });

    // Goods created
    this.events.subscribe('goods:create', (data: any) => {
      if (data.item) {
        var index = this.itemList.findIndex((d: any) => {
          return d.id == data.item.necessary
        });

        let total_count = +this.itemList[index].total_count;
        this.itemList[index].total_count = (total_count > 0 ? total_count + 1 : 1);
      }
    });

    // Goods deleted
    this.events.subscribe('goods:delete', (data: any) => {
      if (data.item) {
        var index = this.itemList.findIndex((d: any) => {
          return d.id == data.item.necessary
        });

        let total_count = +this.itemList[index].total_count;
        this.itemList[index].total_count = (total_count > 0 ? total_count - 1 : 0);
      }
    });
  }

  getItems(isMore: boolean = false, isRefresh: boolean = false): void {
    if (isMore) this.isLoading = false;

    let url = this.nextUrl;
    if  (isRefresh) {
      url = null;
      this.isLoading = true;
    }

    this.necessaryService.getNecessaries({'purchase_uuid': this.purchase.uuid, 'next_url': url})
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
    this.events.unsubscribe('necessary:create');
    this.events.unsubscribe('necessary:update');
    this.events.unsubscribe('necessary:delete');
    this.events.unsubscribe('goods:create');
    this.events.unsubscribe('goods:delete');
  }

}

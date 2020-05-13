import { Component, OnInit, ChangeDetectorRef, ViewRef } from '@angular/core';
import { EventsService } from '../../../../services/events.service';
import { Events } from '../../../../services/events';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage implements OnInit {

  status: any = 'done, rejected';
  purchase: any | null;

  constructor(
    private cd: ChangeDetectorRef,
    private events: Events
  ) {}

  ngOnInit() {
    // Delete
    this.events.subscribe('purchase:delete', (data: any) => {
      setTimeout(() => {
        if (this.cd && !(this.cd as ViewRef).destroyed) {
          this.cd.detectChanges();
        }
      });
    });
  }

  refresh(): void {
    this.events.publish('purchase:refresh', true);
  }

  ngOnDestroy() {
    this.events.unsubscribe('purchase:delete');
  }

}

import { Component, ViewChild, OnInit, ChangeDetectorRef, ViewRef } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

import { PurchaseEditorComponent } from '../../components/purchase-editor/purchase-editor.component';
import { EventsService } from '../../../../services/events.service';
import { Events } from '../../../../services/events';

@Component({
  selector: 'app-purchase',
  templateUrl: 'purchase.page.html',
  styleUrls: ['purchase.page.scss']
})
export class PurchasePage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  
  status: any = 'submitted, draft, reviewed, assigned, processed';
  purchase: any | null;

  constructor(
    private cd: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private events: Events
  ) {}

  async modalPurcahseEditor() {
    const modal = await this.modalCtrl.create({
      component: PurchaseEditorComponent
    });

    modal.onDidDismiss()
      .then((response: any) => {
        this.purchase = response;
    });

    return await modal.present();
  }

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

  createPurchase(): void {
    this.modalPurcahseEditor();
  }

  refresh(): void {
    this.events.publish('purchase:refresh', true);
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }

  ngOnDestroy() {
    this.events.unsubscribe('purchase:delete');
  }

}

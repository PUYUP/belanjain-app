import { Component, OnInit, ChangeDetectorRef, ViewChild, ViewRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ActionSheetController, AlertController, ToastController, NavController, IonInfiniteScroll } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { GoodsEditorComponent } from '../../components/goods-editor/goods-editor.component';
import { metrics } from '../../utils/metric';
import { EventsService } from '../../../../services/events.service';
import { NecessaryService } from '../../../../services/necessary.service';
import { NecessaryEditorComponent } from '../../components/necessary-editor/necessary-editor.component';
import { GoodsService } from '../../../../services/goods.service';
import { Events } from '../../../../services/events';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.page.html',
  styleUrls: ['./goods.page.scss'],
})
export class GoodsPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  purchaseUUID: string;
  necessaryUUID: string;
  status: string = 'processed';
  itemData: any;
  itemList: any;
  purchase: any;
  necessary: any;
  isLoading: boolean = true;
  alertDelete: any = AlertController;
  alertDeleteGoods: any = AlertController;
  errorMessage: string;
  toast: any = ToastController;
  nextUrl: string | null;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private cd: ChangeDetectorRef,
    private events: Events,
    private necessaryService: NecessaryService,
    private goodsService: GoodsService
  ) { }

  async modalGoodsEditor(item: any = '', isEdit: boolean = false) {
    const modal = await this.modalCtrl.create({
      component: GoodsEditorComponent,
      componentProps: {
        'item': item,
        'is_edit': isEdit,
        'purchase': this.purchase,
        'necessary': this.necessary,
      }
    });

    modal.onDidDismiss()
      .then((response: any) => {
        let item = response.data.item;

        if (item) {
          if (isEdit) {
            let index = this.itemList.findIndex((d: any) => d.id == item.id);
            this.itemList[index] = item;
          } else {
            this.itemList.unshift(item);
          }
        }
    });

    return await modal.present();
  }

  async modalNecessaryEditor() {
    const modal = await this.modalCtrl.create({
      component: NecessaryEditorComponent,
      componentProps: { 'purchase': this.purchase, 'item': this.necessary }
    });

    modal.onDidDismiss()
      .then((response: any) => {
        let item = response.data.item;

        if (item) {
          this.necessary = item;
        }
    });

    return await modal.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tindakan',
      buttons: [
        {
          text: 'Rubah',
          icon: 'pencil',
          handler: () => {
            this.modalNecessaryEditor();
          }
        },
        {
          text: 'Hapus',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.presentDeleteConfirm();
          }
        },
        {
          text: 'Batal',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentDeleteConfirm() {
    this.alertDelete = await this.alertController.create({
      header: 'Konfirmasi Tindakan!',
      message: 'Apakah Anda yakin? Data ini akan <strong>TERHAPUS SELAMANYA</strong>.',
      buttons: [
        {
          text: 'Ya, Hapus!',
          handler: () => {
            this.runDelete();
            return false;
          }
        },
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await this.alertDelete.present();
  }

  async presentDeleteGoodsConfirm(item: any) {
    this.alertDeleteGoods = await this.alertController.create({
      header: 'Konfirmasi Tindakan!',
      message: 'Apakah Anda yakin? Data ini akan <strong>TERHAPUS SELAMANYA</strong>.',
      buttons: [
        {
          text: 'Ya, Hapus!',
          handler: () => {
            this.runDeleteGoods(item);
            return false;
          }
        },
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await this.alertDeleteGoods.present();
  }

  /***
   * Show toast message
   */
  async presentToast(message: string) {
    this.toast = await this.toastController.create({
      header: 'Informasi',
      message: message,
      duration: 5000,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    this.toast.present();
  }

  ngOnInit() {
    this.purchaseUUID = this.route.snapshot.paramMap.get('purchase_uuid');
    this.necessaryUUID = this.route.snapshot.paramMap.get('necessary_uuid');
    this.getItems();

    // Delete Goods
    this.events.subscribe('goods:delete', (data: any) => {
      if (data.item) {
        this.itemList = this.itemList.filter((d: any) => d.uuid !== data.item.uuid);

        setTimeout(() => {
          if (this.cd && !(this.cd as ViewRef).destroyed) {
            this.cd.detectChanges();
          }
        });
      }
    });
  }

  createGoods(): void {
    this.modalGoodsEditor();
  }

  selectItem(item: any, isRemove: boolean = false): void {
    if (isRemove === false) {
      this.modalGoodsEditor(item, true);
    }

    if (isRemove) {
      this.presentDeleteGoodsConfirm(item);
    }
  }

  getItems(isMore: boolean = false, isRefresh: boolean = false): void {
    if (isMore) this.isLoading = false;

    let url = this.nextUrl;
    if  (isRefresh) {
      url = null;
      this.isLoading = true;
    }
  
    this.goodsService.getGoods({ 'necessary_uuid': this.necessaryUUID, 'next_url': url })
      .pipe(
        finalize(() => {
          if (!isMore) this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.itemData = response;
          this.purchase = this.itemData.purchase;
          this.necessary = this.itemData.necessary;
          this.nextUrl = this.itemData.navigate.next;

          if (isRefresh) {
            setTimeout(() => {
              if (this.cd && !(this.cd as ViewRef).destroyed) {
                this.cd.detectChanges();
              }
            });
          }
          
          if (isMore && this.itemList) {
            this.itemList = this.itemList.concat(this.itemData.results);
          } else {
            this.itemList = this.itemData.results;
          }
        },
        (failure: any) => {

        }
      )
  }

  refresh(): void {
    this.getItems(false, true);
  }

  moreAction(): void {
    this.presentActionSheet();
  }

  runDelete(): void {
    this.necessaryService.deleteNecessary(this.necessaryUUID)
      .pipe(

      )
      .subscribe(
        (response: any) => {
          this.events.publish('necessary:delete', { 'item': this.necessary });
          this.alertDelete.dismiss();
          this.presentToast('Berhasil dihapus.');
          this.navCtrl.navigateBack(['/purchase', this.purchaseUUID]);
        },
        (failure: any) => {
          if (failure.error) {
            const error: any = failure.error;
  
            for (let e in error) {
              let msg = error[e];
  
              if (msg) {
                this.errorMessage = Array.isArray(msg) ? msg.join(' ') : msg;
              }
            }
  
            this.presentToast(this.errorMessage);
          }
        }
      )
  }

  runDeleteGoods(item: any): void {
    this.goodsService.deleteGoods(item.uuid)
      .pipe(

      )
      .subscribe(
        (response: any) => {
          this.itemList = this.itemList.filter((d: any) => d.id != item.id);
          this.events.publish('goods:delete', { 'item': item });
          this.alertDeleteGoods.dismiss();
          this.presentToast('Berhasil dihapus.');
        },
        (failure: any) => {
          if (failure.error) {
            const error: any = failure.error;
  
            for (let e in error) {
              let msg = error[e];
  
              if (msg) {
                this.errorMessage = Array.isArray(msg) ? msg.join(' ') : msg;
              }
            }
  
            this.presentToast(this.errorMessage);
          }
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
    this.events.unsubscribe('goods:delete');
  }

}

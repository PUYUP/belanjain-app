import { Component, OnInit, ChangeDetectorRef, ViewRef } from '@angular/core';
import { ModalController, AlertController, ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { NecessaryEditorComponent } from '../../components/necessary-editor/necessary-editor.component';
import { PurchaseService } from '../../../../services/purchase.service';
import { PurchaseEditorComponent } from '../../components/purchase-editor/purchase-editor.component';
import { EventsService } from '../../../../services/events.service';
import { Events } from '../../../../services/events';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.page.html',
  styleUrls: ['./purchase-detail.page.scss'],
})
export class PurchaseDetailPage implements OnInit {
  
  toast: any = ToastController;
  alertDelete: any = AlertController;
  uuid: string | null;
  isLoading: boolean = true;
  isSaveLoading: boolean = false;
  purchase: any | null;
  errorMessage: any | null;

  generalStatus: any = ['submitted', 'draft', 'reviewed', 'assigned', 'processed'];
  historyStatus: any = ['done', 'rejected'];

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    private cd: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private purchaseService: PurchaseService,
    private events: Events
  ) {}

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Tindakan!',
      message: 'Apakah Anda yakin? Setelah tindakan ini pesanan <strong class="text-dark">TIDAK BISA DIRUBAH</strong> dan <strong class="text-dark">TIDAK BISA DIBATALKAN</strong>.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ya, Kirim ke Operator',
          handler: () => {
            this.updateStatus();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentDeleteConfirm() {
    this.alertDelete = await this.alertController.create({
      header: 'Konfirmasi Tindakan!',
      message: 'Apakah Anda yakin? Daftar belanja ini akan <strong>TERHAPUS SELAMANYA</strong>.',
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

  async modalNecessaryEditor() {
    const modal = await this.modalCtrl.create({
      component: NecessaryEditorComponent,
      componentProps: { 'purchase': this.purchase }
    });

    modal.onDidDismiss()
      .then((response: any) => {
        let item = response.data.item;

        if (item) {
          // console.log(item);
        }
    });

    return await modal.present();
  }

  async modalPurcahseEditor() {
    const modal = await this.modalCtrl.create({
      component: PurchaseEditorComponent,
      componentProps: {'item': this.purchase},
    });

    modal.onDidDismiss()
      .then((response: any) => {
        if (response.data.item) this.purchase = response.data.item;
    });

    return await modal.present();
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
    this.uuid = this.route.snapshot.paramMap.get('purchase_uuid');
    this.getObject();
  }

  createNecessary(): void {
    this.modalNecessaryEditor();
  }

  sendToOperator(): void {
    this.presentAlertConfirm();
  }

  getObject(): void {
    this.purchaseService.getPurchase(this.uuid)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.purchase = response;
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

  callOperator(operator: any): void {
    console.log(operator);
  }

  changePurchase(): void {
    this.modalPurcahseEditor();
  }

  updateStatus(): void {
    this.isSaveLoading = true;

    this.purchaseService.updatePurchase({'status': 'submitted', 'uuid': this.purchase.uuid})
    .pipe(
      finalize(() => {
        this.isSaveLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.events.publish('purchase:update', { 'item': response });
        this.purchase = response;
        
        setTimeout(() => {
          if (this.cd && !(this.cd as ViewRef).destroyed) {
            this.cd.detectChanges();
          }
        });
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

  delete(): void {
    this.presentDeleteConfirm();
  }

  runDelete(): void {
    this.purchaseService.deletePurchase(this.purchase.uuid)
      .pipe(

      )
      .subscribe(
        (response: any) => {
          this.events.publish('purchase:delete', { 'item': this.purchase });
          this.alertDelete.dismiss();
          this.presentToast('Berhasil dihapus.');

          if (this.generalStatus.includes(this.purchase.status)) {
            this.navCtrl.navigateBack('/tabs/purchase');
          }

          if (this.historyStatus.includes(this.purchase.status)) {
            this.navCtrl.navigateBack('/tabs/history');
          }
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

}

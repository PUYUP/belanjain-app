import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { AddressEditorComponent } from '../../components/address-editor/address-editor.component';
import { ShippingService } from '../../../../services/shipping.service';
import { EventsService } from '../../../../services/events.service';


@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  isOnLoading: boolean = true;
  address: any | null;
  addressList: any | null;

  constructor(
    private modalCtrl: ModalController,
    private shippingService: ShippingService,
    private events: EventsService,
  ) { }

  async presentModal(item: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddressEditorComponent,
      componentProps: {
        'item': item
      }
    });

    modal.onDidDismiss()
      .then((response: any) => {
        let item = response.data.item;
  
        if (item && item.is_update) {
          this.addressList.map((d: any) => {
            if (item.uuid === d.uuid) {
              d.is_default = item.is_default;
            } else {
              d.is_default = false;
            }

            return d;
          });
        }

        if (item) {
          // Initial
          if (this.addressList.length == 0) {
            this.addressList.push(item);
          }

          // Refresh if new address added
          if (this.addressList.length > 0 && !item.is_update) {
            this.getAllAdress();
          }
        }
    });
  
    return await modal.present();
  }

  ngOnInit() {
    this.getAllAdress();
  }

  addAddress(): void {
    this.presentModal();
  }

  getAllAdress() {
    this.shippingService.getAllShippingAddress()
      .pipe(
        finalize(() => {
          this.isOnLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          if (response) this.addressList = response.results;
        },
        (failure) => {

        }
      );
  }

  getAdress(uuid: string = null) {
    this.shippingService.getShippingAddress(uuid)
      .pipe(
        finalize(() => {
          this.isOnLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          if (response) {
            this.address = response;
            this.presentModal(this.address);
          }
        },
        (failure) => {

        }
      );
  }

  updateAddress(item: any): void {
    this.getAdress(item.uuid);
  }

  delete(item: any): void {
    this.shippingService.deleteShippingAddress(item.uuid)
      .pipe(
        finalize(() => {
          
        })
      )
      .subscribe(
        (response: any) => {
          this.addressList = this.addressList.filter((d: any) => d.uuid !== item.uuid)
        },
        (failure) => {

        }
      );
  }

}

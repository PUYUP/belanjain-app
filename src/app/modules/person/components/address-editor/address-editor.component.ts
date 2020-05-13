import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ShippingService } from '../../../../services/shipping.service';
import { EventsService } from '../../../../services/events.service';

@Component({
  selector: 'app-address-editor',
  templateUrl: './address-editor.component.html',
  styleUrls: ['./address-editor.component.scss'],
})
export class AddressEditorComponent implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  @Input() item: any;

  formFactoryIsvalid: boolean = false;
  formFactory: any = FormBuilder;
  isLoading: boolean = false;
  toast: any = ToastController;

  constructor(
    private fb: FormBuilder,
    public toastController: ToastController,
    private modalCtrl: ModalController,
    private shippingService: ShippingService,
    private events: EventsService
  ) { }

  /***
   * Show toast message
   */
  async presentToast(message: string) {
    this.toast = await this.toastController.create({
      header: 'Informasi',
      message: message,
      duration: 2500,
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
    this.formFactory = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(2)]],
      recipient: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(14)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      postal_code: ['', [Validators.required, Validators.minLength(5)]],
      is_default: [false],
      notes: [''],
    });

    this.formFactory.valueChanges.subscribe((data: any) => {
      this.formFactoryIsvalid = this.formFactory.valid;
    });

    for (let key in this.item) {
      this.formFactory.patchValue({
        [key]: this.item[key]
      });
    }
  }

  save(): void {
    this.form.ngSubmit.emit();
  }

  onSubmit(): any {
    this.isLoading = true;

    if (this.item) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.shippingService.addShippingAddress(this.formFactory.value)
      .pipe(
        finalize(() => {
          this.formFactory.markAsPristine();
          this.dismiss();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.events.publish('addShippingAddressEvent', response);
          this.item = response;
          this.presentToast('Berhasil ditambahkan.');
        },
        (failure: any) => {

        }
      );
  }

  update(): void {
    this.formFactory.value.uuid = this.item.uuid;
  
    this.shippingService.updateShippingAddress(this.formFactory.value)
      .pipe(
        finalize(() => {
          this.formFactory.markAsPristine();
          this.dismiss();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.events.publish('updateShippingAddressEvent', response);
          this.item = response;
          this.item.is_update = true;
          this.presentToast('Pembaruan berhasil.');
        },
        (failure: any) => {

        }
      );
  }

  get fmControl() {
    return this.formFactory.controls;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'item': this.item,
    });
  }

}

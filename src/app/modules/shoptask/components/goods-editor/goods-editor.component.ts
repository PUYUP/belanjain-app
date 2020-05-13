import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

import { metrics } from '../../utils/metric';
import { GoodsService } from '../../../../services/goods.service';
import { EventsService } from '../../../../services/events.service';
import { finalize } from 'rxjs/operators';
import { Events } from '../../../../services/events';

@Component({
  selector: 'app-goods-editor',
  templateUrl: './goods-editor.component.html',
  styleUrls: ['./goods-editor.component.scss'],
})
export class GoodsEditorComponent implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  @Input() item: any;
  @Input() is_edit: boolean;
  @Input() purchase: any;
  @Input() necessary: any;

  formFactoryIsvalid: boolean = false;
  formFactory: any = FormBuilder;
  toast: any = ToastController;
  metrics: any = metrics;
  goods: any;
  errorMessage: string;
  isSaveLoading: boolean = false;

  constructor(
    private toastController: ToastController,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private goodsService: GoodsService,
    private events: Events
  ) { }

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
    this.formFactory = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(2)]],
      quantity: ['', [Validators.required]],
      metric: ['', [Validators.required]],
      description: [''],
    });

    // Update
    if (this.item) {
      this.formFactory.patchValue({
        label: this.item.label,
        quantity: this.item.quantity,
        metric: this.item.metric,
        description: this.item.description,
      });
    }

    this.formFactory.valueChanges.subscribe((data: any) => {
      this.formFactoryIsvalid = this.formFactory.valid;
    });

    if (this.formFactory.valid === true) {
      this.formFactoryIsvalid = true;
    }
  }

  get fmControl() {
    return this.formFactory.controls;
  }

  save(): void {
    this.form.ngSubmit.emit();
  }

  onSubmit(): any {
    this.isSaveLoading = true;

    if (this.item) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.formFactory.value.necessary = this.necessary.id;
    this.goodsService.createGoods(this.formFactory.value)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.goods = response;
          this.events.publish('goods:create', { 'item': this.goods });
          this.dismiss();
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

  update(): void {
    this.formFactory.value.uuid = this.item.uuid;
    this.goodsService.updateGoods(this.formFactory.value)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.goods = response;
          this.events.publish('goodsUpdateEvent', { 'item': this.goods });
          this.dismiss();
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

  dismiss() {
    if (this.goods) {
      this.goods.metric = metrics[this.formFactory.value.metric];
    } else {
      this.goods = this.item;
    }

    this.modalCtrl.dismiss({
      'dismissed': true,
      'item': this.formFactory.valid ? this.goods : '',
    });
  }

}

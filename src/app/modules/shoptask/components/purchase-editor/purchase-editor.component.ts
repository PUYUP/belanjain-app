import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { ShippingService } from '../../../../services/shipping.service';
import { PurchaseService } from '../../../../services/purchase.service';
import { EventsService } from '../../../../services/events.service';
import { Router } from '@angular/router';
import { Events } from '../../../../services/events';

@Component({
  selector: 'app-purchase-editor',
  templateUrl: './purchase-editor.component.html',
  styleUrls: ['./purchase-editor.component.scss'],
})
export class PurchaseEditorComponent implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  @Input() item: any;

  formFactoryIsvalid: boolean = false;
  formFactory: any = FormBuilder;
  defaultAddress: any;
  isLoading: boolean = true;
  isSaveLoading: boolean = false;
  shippingTo: any | null;
  purchase: any | null;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private shippingService: ShippingService,
    private purchaseService: PurchaseService,
    private events: Events,
    private router: Router
  ) { }

  ngOnInit() {
    this.getShippings();

    this.formFactory = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      date_picker: ['', [Validators.required]],
      time_picker: ['', [Validators.required]],
      shipping_to: ['', [Validators.required]],
    });

    this.formFactory.valueChanges.subscribe((data: any) => {
      this.formFactoryIsvalid = this.formFactory.valid;
    });
  }

  getShippings(): void {
    this.shippingService.getAllShippingAddress()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.shippingTo = response.results;
          
          this.defaultAddress = this.shippingTo.find((obj: any) => {
            return obj.is_default === true
          });

          // Set default shipping address for new item
          if (this.defaultAddress && !this.item) {
            this.formFactory.patchValue({
              shipping_to: this.defaultAddress.id.toString()
            });
          }

          // Change action
          if (this.item) {
            this.formFactory.patchValue({
              label: this.item.label,
              description: this.item.description,
              date_picker: this.item.schedule,
              time_picker: this.item.schedule,
            });

            if (this.item.purchase_shippings.length > 0) {
              this.formFactory.patchValue({
                shipping_to: this.item.purchase_shippings[0].shipping_to.id.toString()
              });
            }
          }
        },
        (failure) => {
          
        }
      );
  }

  save(): void {
    this.form.ngSubmit.emit();
  }

  onSubmit(): any {
    let values = this.formFactory.value;
    let date =  formatDate(values.date_picker, 'yyyy-LL-dd', 'en-US', 'UTC+07:00');
    let time =  formatDate(values.time_picker, 'HH:mm:ss', 'en-US', 'UTC+07:00');
    let schedule = date + ' ' + time;

    this.isSaveLoading = true;
    this.formFactory.value.schedule = schedule;
    this.formFactory.value.purchase_shippings = [
      {'shipping_to': values.shipping_to}
    ];

    if (this.item) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.purchaseService.createPurchase(this.formFactory.value)
    .pipe(
      finalize(() => {
        this.isSaveLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.purchase = response;
        this.events.publish('purchase:create', {'item': response});
        this.router.navigate(['/purchase', this.purchase.uuid]).then(() => {
          this.dismiss();
        });
      },
      (failure: any) => {

      }
    )
  }

  update(): void {
    this.formFactory.value.uuid = this.item.uuid;

    this.purchaseService.updatePurchase(this.formFactory.value)
    .pipe(
      finalize(() => {
        this.isSaveLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.purchase = response;
        this.events.publish('purchase:update', {'item': response});
        this.dismiss();
      },
      (failure: any) => {

      }
    )
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'item': this.formFactory.valid ? this.purchase : '',
    });
  }

}

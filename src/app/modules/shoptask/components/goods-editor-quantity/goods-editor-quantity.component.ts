import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm, FormBuilder, Validators } from '@angular/forms';

import { metrics } from '../../utils/metric';

@Component({
  selector: 'app-goods-editor-quantity',
  templateUrl: './goods-editor-quantity.component.html',
  styleUrls: ['./goods-editor-quantity.component.scss'],
})
export class GoodsEditorQuantityComponent implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  @Input() item: any;

  formFactoryIsvalid: boolean = false;
  formFactory: any = FormBuilder;
  metrics: any = metrics;
  title: string;
  
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.title = this.item.label;

    this.formFactory = this.fb.group({
      quantity: ['', [Validators.required]],
      metric: ['', [Validators.required]],
      description: [''],
    });

    this.formFactory.valueChanges.subscribe((data: any) => {
      this.formFactoryIsvalid = this.formFactory.valid;
    });

    if (this.formFactory.valid === true) {
      this.formFactoryIsvalid = true;
    }

    // Update
    if (this.item) {
      this.formFactory.patchValue({
        quantity: this.item.quantity,
        metric: this.item.metric,
        description: this.item.description,
      });
    }
  }

  get fmControl() {
    return this.formFactory.controls;
  }

  save(): void {
    this.form.ngSubmit.emit();
  }

  onSubmit(): any {
    this.dismiss();
    this.formFactory.reset();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    if (this.formFactory.valid === true) {
      this.item.quantity = this.formFactory.value.quantity;
      this.item.metric = metrics[this.formFactory.value.metric];
      this.item.is_selected = true;
    }

    this.modalCtrl.dismiss({
      'dismissed': true,
      'item': this.formFactory.valid ? this.item : '',
    });
  }

}

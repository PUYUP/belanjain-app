import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { NecessaryService } from '../../../../services/necessary.service';
import { EventsService } from '../../../../services/events.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Events } from '../../../../services/events';

@Component({
  selector: 'app-necessary-editor',
  templateUrl: './necessary-editor.component.html',
  styleUrls: ['./necessary-editor.component.scss'],
})
export class NecessaryEditorComponent implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  @Input() purchase: any;
  @Input() item: any;

  formFactoryIsvalid: boolean = false;
  formFactory: any = FormBuilder;
  necessary: any;
  isSaveLoading: boolean = false;
  errorMessage: string;
  toast: any = ToastController;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private router: Router,
    private necessaryService: NecessaryService,
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
      description: [''],
    });

    this.formFactory.valueChanges.subscribe((data: any) => {
      this.formFactoryIsvalid = this.formFactory.valid;
    });

    // Update
    if (this.item) {
      this.formFactory.patchValue({
        label: this.item.label,
        description: this.item.description,
      });
    }
  }

  save(): void {
    this.form.ngSubmit.emit();
  }

  onSubmit(): any {
    this.isSaveLoading = true;
    this.formFactory.value.purchase = this.purchase.id;
    
    if (this.item) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.necessaryService.createNecessary(this.formFactory.value)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
          this.events.publish('necessary:create', { 'item': this.necessary });
        })
      )
      .subscribe(
        (response: any) => {
          this.necessary = response;
          this.router.navigate(['/purchase', this.purchase.uuid, 'necessary', this.necessary.uuid, 'goods'])
            .then(() => {
              this.dismiss();
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

  update(): void {
    this.formFactory.value.uuid = this.item.uuid;

    this.necessaryService.updateNecessary(this.formFactory.value)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.necessary = response;
          this.events.publish('necessary:update', { 'item': response });
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
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'item': this.formFactory.valid ? this.necessary : '',
    });
  }

}

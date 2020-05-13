import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { PersonService } from '../../../../services/person.service';
import { EventsService } from '../../../../services/events.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formFactory: any = FormBuilder;
  isLoading: boolean = false;
  errorMessage: any | null;
  toast: any = ToastController;

  constructor(
    public toastController: ToastController,
    private fb: FormBuilder,
    private router: Router,
    private personService: PersonService,
    private events: EventsService
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
      telephone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fmControl() {
    return this.formFactory.controls;
  }

  onSubmit() {
    this.login();
  }

  /***
   * Login
   */
  login(): any {
    this.isLoading = true;
    this.formFactory.value.username = this.formFactory.value.telephone;

    this.personService.login(this.formFactory.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.events.publish('loginEvent', response);
          this.router.navigate(['/tabs/purchase'], {replaceUrl: true});
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
      );
  }

}

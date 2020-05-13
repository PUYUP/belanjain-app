import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { MustMatch } from '../../../../utils/must-match.validator';
import { environment } from '../../../../../environments/environment';
import { PersonService } from '../../../../services/person.service';
import { EventsService } from '../../../../services/events.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formFactory: any = FormBuilder;
  isLoading: boolean = false;
  isLoginLoading: boolean = false;
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
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      first_name: ['', [Validators.required, Validators.minLength(4)]],
      telephone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(14)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validator: MustMatch('password', 'password_confirm')
    });
  }

  get fmControl() {
    return this.formFactory.controls;
  }

  onSubmit() {
    this.isLoading = true;
  
    let email = this.formFactory.value.username + '@' + environment.domain;

    this.formFactory.value.email = email;
    this.register(this.formFactory.value);
  }

  /***
   * Check telephone
   */
  checkTelephone(telephone: string, values: any): any {
    this.personService.checkTelephone({'telephone': telephone})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          this.register(values);
        },
        failure => {
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

  /***
   * Register action
   */
  register(values: any): void {
    this.personService.register(values)
      .pipe(
        finalize(() => {
          this.formFactory.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          // Login
          this.login(
            {
              'username': this.formFactory.value.username,
              'password': this.formFactory.value.password_confirm
            });
        },
        failure => {
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

  /***
   * Login after register
   */
  login(context: any): any {
    this.isLoginLoading = true;

    this.personService.login(context)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.isLoginLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          let navigationExtras: NavigationExtras = {
            replaceUrl: true,
            state: {
              segment: 'validation'
            }
          };

          this.events.publish('loginEvent', response);
          this.router.navigate(['/address'], navigationExtras);
        },
        (failure: any) => {

        }
      );
  }

}

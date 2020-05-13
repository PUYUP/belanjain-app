import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { PersonService } from '../../../../services/person.service';
import { EventsService } from '../../../../services/events.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss'],
})
export class SecurityPage implements OnInit {

  personData: any | null;
  object: any | null;
  isLoading: boolean = true;
  isSaveLoading: boolean = false;
  formFactoryIsvalid: boolean = false;
  toast: any = ToastController;
  errorMessage: any;

  newValue: string | null;
  password: string | null;
  username: string | null;
  email: string | null;
  telephone: string | null;

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private personService: PersonService,
    private events: EventsService,
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

  async presentAlertPrompt(field: string) {
    let msg = '';

    if (field === 'password') {
      msg = 'Masukkan password lama.';
    } else {
      msg = 'Password Anda.';
    }

    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: msg,
      backdropDismiss: false,
      inputs: [
        {
          name: 'current_password',
          type: 'password',
          placeholder: 'Masukkan password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Kirim',
          handler: (data: any) => {
            this.update(field, data['current_password']);
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.personData = this.personService.getLocalToken();
    this.getObject();
  }

  getObject(): void {
    this.isLoading = true;

    this.personService.security(this.personData.id)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.object = response;

        this.username = this.object.username;
        this.email = this.object.email;
        this.telephone = this.object.telephone;
      },
      (failure: any) => {

      }
    )
  }

  securiyChanged(value: string, field: string): void {
    this.newValue = value;
    
    if (field === 'password') {
      this.password = value;
    } else if (field === 'username') {
      this.username = value;
    } else if (field === 'email') {
      this.email = value;
    } else if (field === 'telephone') {
      this.telephone = value;
    }
  }

  save(field: string): void {
    this.presentAlertPrompt(field);
  }

  cancel(field: string): void {
    if (field === 'password') {
      this.password = this.object.password;
    } else if (field === 'username') {
      this.username = this.object.username;
    } else if (field === 'email') {
      this.email = this.object.email;
    } else if (field === 'telephone') {
      this.telephone = this.object.telephone;
    }
  }

  logout(): void {
    this.personService.logout()
      .pipe(
        finalize(() => {
          this.events.publish('personLogoutEvent', true);
        })
      )
      .subscribe(
        (response: any) => {
          
        },
        (failure: any) => {

        }
      );
  }

  update(field: string, current_password: string): void {
    let data = {
      [field]: this.newValue,
      'current_password': current_password,
    }

    this.personService.updateSecurity(this.personData.id, data)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        if (field === 'password') {
          this.presentToast('Berhasil dirubah. Masuk dengan password baru.');
          this.alertController.dismiss();
          this.router.navigate(['/login'], {replaceUrl: true});
          this.personService.logout();
        } else {
          this.presentToast('Pembaruan berhasil.');
          this.alertController.dismiss();
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

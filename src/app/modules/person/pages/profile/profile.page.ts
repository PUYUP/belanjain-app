import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { PersonService } from '../../../../services/person.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  
  personData: any | null;
  profile: any | null;
  isLoading: boolean = true;
  isSaveLoading: boolean = false;
  formFactoryIsvalid: boolean = false;
  formFactory: any = FormBuilder;
  toast: any = ToastController;

  constructor(
    public toastController: ToastController,
    private fb: FormBuilder,
    private personService: PersonService
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
    this.personData = this.personService.getLocalToken();
    this.getObject();

    this.formFactory = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(4)]],
      biography: [''],
    });

    this.formFactory.valueChanges.subscribe((data: any) => {
      this.formFactoryIsvalid = this.formFactory.valid;
    });
  }

  getObject(): void {
    this.personService.profile(this.personData.id)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.profile = response;
        
        // Set form value
        this.formFactory.patchValue({
          first_name: this.profile.first_name,
          biography: this.profile.biography,
        });
      },
      (failure: any) => {

      }
    )
  }

  get fmControl() {
    return this.formFactory.controls;
  }

  save(): void {
    this.form.ngSubmit.emit();
  }

  onSubmit() {
    this.isSaveLoading = true;

    this.personService.updateProfile(this.personData.id, this.formFactory.value)
    .pipe(
      finalize(() => {
        this.isSaveLoading = false;
      })
    )
    .subscribe(
      (response: any) => {
        this.presentToast('Pembaruan berhasil!');
      },
      (failure: any) => {

      }
    )
  }

}

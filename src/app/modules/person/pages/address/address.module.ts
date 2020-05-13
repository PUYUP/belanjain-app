import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressPageRoutingModule } from './address-routing.module';

import { AddressPage } from './address.page';

import { SharedModule } from '../../../../utils/shared.module';
import { AddressEditorComponent } from '../../components/address-editor/address-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressPageRoutingModule,
    SharedModule
  ],
  declarations: [
    AddressPage,
    AddressEditorComponent
  ],
  entryComponents: [
    AddressEditorComponent
  ]
})
export class AddressPageModule {}

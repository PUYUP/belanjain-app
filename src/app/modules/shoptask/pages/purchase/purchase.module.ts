import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchasePage } from './purchase.page';

import { SharedModule } from '../../../../utils/shared.module';
import { PurchasePageRoutingModule } from './purchase-routing.module';
import { PurchaseListComponent } from '../../components/purchase-list/purchase-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PurchasePageRoutingModule,
    SharedModule
  ],
  declarations: [
    PurchasePage,
    //PurchaseListComponent
  ],
  entryComponents: [
    //PurchaseListComponent
  ]
})
export class PurchasePageModule {}

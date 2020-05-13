import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../../utils/shared.module';
import { PurchaseDetailPageRoutingModule } from './purchase-detail-routing.module';
import { PurchaseDetailPage } from './purchase-detail.page';
import { NecessaryListComponent } from '../../components/necessary-list/necessary-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PurchaseDetailPage,
    NecessaryListComponent
  ],
  entryComponents: [
    NecessaryListComponent
  ]
})
export class PurchaseDetailPageModule {}

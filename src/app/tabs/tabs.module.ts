import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { AccountPageModule } from '../modules/person/pages/account/account.module';
import { PurchasePageModule } from '../modules/shoptask/pages/purchase/purchase.module';
import { HistoryPageModule } from '../modules/shoptask/pages/history/history.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    PurchasePageModule,
    HistoryPageModule,
    AccountPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}

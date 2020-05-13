import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryPage } from './history.page';

import { HistoryPageRoutingModule } from './history-routing.module';
import { SharedModule } from '../../../../utils/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}

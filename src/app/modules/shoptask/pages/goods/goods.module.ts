import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../../utils/shared.module';
import { GoodsPageRoutingModule } from './goods-routing.module';
import { GoodsPage } from './goods.page';
import { GoodsEditorComponent } from '../../components/goods-editor/goods-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoodsPageRoutingModule,
    SharedModule
  ],
  declarations: [
    GoodsPage,
    GoodsEditorComponent
  ],
  entryComponents: [
    GoodsEditorComponent
  ]
})
export class GoodsPageModule {}

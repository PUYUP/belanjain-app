import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../../utils/shared.module';
import { CatalogPageRoutingModule } from './catalog-routing.module';
import { CatalogPage } from './catalog.page';
import { GoodsEditorQuantityComponent } from '../../components/goods-editor-quantity/goods-editor-quantity.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogPageRoutingModule,
    SharedModule
  ],
  declarations: [
    CatalogPage,
    GoodsEditorQuantityComponent
  ],
  entryComponents: [
    GoodsEditorQuantityComponent
  ]
})
export class CatalogPageModule {}

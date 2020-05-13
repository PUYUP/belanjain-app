import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoptaskRoutingModule } from './shoptask-routing.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ShoptaskRoutingModule
    ],
    declarations: [],
    exports: []
})
export class ShoptaskModule {}

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PersonRoutingModule
    ],
    declarations: [],
    exports: []
})
export class PersonModule {}

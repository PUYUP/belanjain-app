import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { PurchaseEditorComponent } from '../modules/shoptask/components/purchase-editor/purchase-editor.component';
import { NecessaryEditorComponent } from '../modules/shoptask/components/necessary-editor/necessary-editor.component';
import { PurchaseListComponent } from '../modules/shoptask/components/purchase-list/purchase-list.component';

@NgModule({ 
    imports: [
        IonicModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        PurchaseEditorComponent,
        NecessaryEditorComponent,
        PurchaseListComponent
    ],
    declarations: [
        PurchaseEditorComponent,
        NecessaryEditorComponent,
        PurchaseListComponent
    ],
    entryComponents: [
        PurchaseEditorComponent,
        NecessaryEditorComponent,
        PurchaseListComponent
    ]
})
export class SharedModule {}
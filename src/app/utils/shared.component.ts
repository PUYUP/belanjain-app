import { NgModule } from "@angular/core";
import { PurchaseEditorComponent } from "../modules/shoptask/components/purchase-editor/purchase-editor.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    declarations: [
        PurchaseEditorComponent
    ],
    exports:[
        IonicModule,
        CommonModule,
        PurchaseEditorComponent
    ]
})
export class SharedComponent {}
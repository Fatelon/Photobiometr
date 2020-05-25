import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightVersionComponent } from './light-version.component';
import { SelectionSheetComponent } from './components/selection-sheet/selection-sheet.component';
import { LightVersionRoutingModule } from './light-version.routes';

@NgModule({
  imports: [
    CommonModule,
    LightVersionRoutingModule
  ],
  declarations: [
    LightVersionComponent,
    SelectionSheetComponent
  ]
})
export class LightVersionModule { }

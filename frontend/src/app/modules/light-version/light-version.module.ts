import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightVersionComponent } from './light-version.component';
import { SelectPhotoComponent } from './components/select-photo/select-photo.component';
import { LightVersionRoutingModule } from './light-version.routes';
import { EditPanelComponent } from './components/edit-panel/edit-panel.component';
import { DrawingAreaComponent } from './components/drawing-area/drawing-area.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';


const materialModules = [
  MatTooltipModule,
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatRadioModule
];

@NgModule({
  imports: [
    CommonModule,
    LightVersionRoutingModule,
    materialModules
  ],
  declarations: [
    LightVersionComponent,
    SelectPhotoComponent,
    EditPanelComponent,
    DrawingAreaComponent
  ]
})
export class LightVersionModule { }

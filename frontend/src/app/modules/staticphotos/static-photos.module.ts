import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailsComponent } from './components/thumbnails/thumbnails.component';
import { EditPanelComponent } from './components/edit-panel/edit-panel.component';
import { ExifInfoComponent } from './components/exif-info/exif-info.component';
import { MeasuresInfoComponent } from './components/measures-info/measures-info.component';
import { MousewheelDirective } from './directives/mousewheel.directive';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { StaticPhotosRoutingModule } from './static-photos.routes';

const materialModules = [
  MatTooltipModule,
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule
];

@NgModule({
  imports: [
    CommonModule,
    StaticPhotosRoutingModule,
    materialModules,
  ],
  declarations: [
    ThumbnailsComponent,
    EditPanelComponent,
    ExifInfoComponent,
    MeasuresInfoComponent,
    MousewheelDirective
  ]
})
export class StaticPhotosModule { }

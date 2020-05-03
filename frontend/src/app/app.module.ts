import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThumbnailsComponent } from './components/thumbnails/thumbnails.component';
import { EditPanelComponent } from './components/edit-panel/edit-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExifInfoComponent } from './components/exif-info/exif-info.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MeasuresInfoComponent } from './components/measures-info/measures-info.component';
import { MousewheelDirective } from './directives/mousewheel.directive';

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
  declarations: [
    AppComponent,
    ThumbnailsComponent,
    EditPanelComponent,
    ExifInfoComponent,
    MeasuresInfoComponent,
    MousewheelDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ...materialModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThumbnailsComponent } from './components/thumbnails/thumbnails.component';

const STATIC_PHOTOS_ROUTER: Routes = [
  {
    path: '',
    component: ThumbnailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(STATIC_PHOTOS_ROUTER)],
  exports: [RouterModule]
})
export class StaticPhotosRoutingModule {
}

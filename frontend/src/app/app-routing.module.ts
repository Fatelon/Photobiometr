import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/staticphotos/static-photos.module').then(m => m.StaticPhotosModule)
  },
  {
    path: 'light',
    loadChildren: () => import('./modules/light-version/light-version.module').then(m => m.LightVersionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

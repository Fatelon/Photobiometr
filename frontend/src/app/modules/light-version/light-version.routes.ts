import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LightVersionComponent } from './light-version.component';

const LIGHT_VERSION_ROUTER: Routes = [
  {
    path: '',
    component: LightVersionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(LIGHT_VERSION_ROUTER)],
  exports: [RouterModule]
})
export class LightVersionRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangetimePage } from './changetime.page';

const routes: Routes = [
  {
    path: '',
    component: ChangetimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangetimePageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StarttestPage } from './starttest.page';

const routes: Routes = [
  {
    path: '',
    component: StarttestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StarttestPageRoutingModule {}

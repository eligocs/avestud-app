import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SDoubtsPage } from './s-doubts.page';

const routes: Routes = [
  {
    path: '',
    component: SDoubtsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SDoubtsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecUnitPage } from './lec-unit.page';

const routes: Routes = [
  {
    path: '',
    component: LecUnitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecUnitPageRoutingModule {}

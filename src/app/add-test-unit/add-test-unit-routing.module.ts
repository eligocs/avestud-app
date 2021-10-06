import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTestUnitPage } from './add-test-unit.page';

const routes: Routes = [
  {
    path: '',
    component: AddTestUnitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTestUnitPageRoutingModule {}

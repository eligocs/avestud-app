import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAssignmentUnitPage } from './add-assignment-unit.page';

const routes: Routes = [
  {
    path: '',
    component: AddAssignmentUnitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAssignmentUnitPageRoutingModule {}

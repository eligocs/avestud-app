import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SAssignmentsPage } from './s-assignments.page';

const routes: Routes = [
  {
    path: '',
    component: SAssignmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SAssignmentsPageRoutingModule {}

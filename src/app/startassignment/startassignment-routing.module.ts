import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartassignmentPage } from './startassignment.page';

const routes: Routes = [
  {
    path: '',
    component: StartassignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartassignmentPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishAssignmentPage } from './publish-assignment.page';

const routes: Routes = [
  {
    path: '',
    component: PublishAssignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishAssignmentPageRoutingModule {}

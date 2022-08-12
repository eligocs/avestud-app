import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffLineStudentsPage } from './off-line-students.page';

const routes: Routes = [
  {
    path: '',
    component: OffLineStudentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffLineStudentsPageRoutingModule {}

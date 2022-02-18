import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentDoubtsPage } from './student-doubts.page';

const routes: Routes = [
  {
    path: '',
    component: StudentDoubtsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentDoubtsPageRoutingModule {}

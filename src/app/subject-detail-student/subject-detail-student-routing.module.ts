import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubjectDetailStudentPage } from './subject-detail-student.page';

const routes: Routes = [
  {
    path: '',
    component: SubjectDetailStudentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectDetailStudentPageRoutingModule {}

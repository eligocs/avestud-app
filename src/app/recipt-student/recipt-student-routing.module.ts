import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReciptStudentPage } from './recipt-student.page';

const routes: Routes = [
  {
    path: '',
    component: ReciptStudentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReciptStudentPageRoutingModule {}

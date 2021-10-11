import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudenthomePage } from './studenthome.page';

const routes: Routes = [
  {
    path: '',
    component: StudenthomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudenthomePageRoutingModule {}

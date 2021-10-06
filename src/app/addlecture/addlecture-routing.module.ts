import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddlecturePage } from './addlecture.page';

const routes: Routes = [
  {
    path: '',
    component: AddlecturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddlecturePageRoutingModule {}

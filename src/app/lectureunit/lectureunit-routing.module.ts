import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LectureunitPage } from './lectureunit.page';

const routes: Routes = [
  {
    path: '',
    component: LectureunitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LectureunitPageRoutingModule {}

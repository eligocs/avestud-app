import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SLecturesPage } from './s-lectures.page';

const routes: Routes = [
  {
    path: '',
    component: SLecturesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SLecturesPageRoutingModule {}

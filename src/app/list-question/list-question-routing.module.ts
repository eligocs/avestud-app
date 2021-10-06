import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListQuestionPage } from './list-question.page';

const routes: Routes = [
  {
    path: '',
    component: ListQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListQuestionPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateofflinetimePage } from './updateofflinetime.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateofflinetimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateofflinetimePageRoutingModule {}

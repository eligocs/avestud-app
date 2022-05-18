import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtraNotesPage } from './extra-notes.page';

const routes: Routes = [
  {
    path: '',
    component: ExtraNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtraNotesPageRoutingModule {}

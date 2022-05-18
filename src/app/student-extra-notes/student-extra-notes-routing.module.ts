import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentExtraNotesPage } from './student-extra-notes.page';

const routes: Routes = [
  {
    path: '',
    component: StudentExtraNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentExtraNotesPageRoutingModule {}

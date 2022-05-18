import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentExtraNotesPageRoutingModule } from './student-extra-notes-routing.module';

import { StudentExtraNotesPage } from './student-extra-notes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentExtraNotesPageRoutingModule
  ],
  declarations: [StudentExtraNotesPage]
})
export class StudentExtraNotesPageModule {}

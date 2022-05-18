import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtraNotesPageRoutingModule } from './extra-notes-routing.module';

import { ExtraNotesPage } from './extra-notes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtraNotesPageRoutingModule
  ],
  declarations: [ExtraNotesPage]
})
export class ExtraNotesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentDoubtsPageRoutingModule } from './student-doubts-routing.module';

import { StudentDoubtsPage } from './student-doubts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentDoubtsPageRoutingModule
  ],
  declarations: [StudentDoubtsPage]
})
export class StudentDoubtsPageModule {}

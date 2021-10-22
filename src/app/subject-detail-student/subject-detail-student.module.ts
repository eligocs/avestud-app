import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubjectDetailStudentPageRoutingModule } from './subject-detail-student-routing.module';

import { SubjectDetailStudentPage } from './subject-detail-student.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubjectDetailStudentPageRoutingModule
  ],
  declarations: [SubjectDetailStudentPage]
})
export class SubjectDetailStudentPageModule {}

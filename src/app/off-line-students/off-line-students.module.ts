import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffLineStudentsPageRoutingModule } from './off-line-students-routing.module';

import { OffLineStudentsPage } from './off-line-students.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffLineStudentsPageRoutingModule
  ],
  declarations: [OffLineStudentsPage]
})
export class OffLineStudentsPageModule {}

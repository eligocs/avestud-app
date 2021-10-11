import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudenthomePageRoutingModule } from './studenthome-routing.module';

import { StudenthomePage } from './studenthome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudenthomePageRoutingModule
  ],
  declarations: [StudenthomePage]
})
export class StudenthomePageModule {}

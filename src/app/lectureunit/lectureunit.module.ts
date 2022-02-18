import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LectureunitPageRoutingModule } from './lectureunit-routing.module';

import { LectureunitPage } from './lectureunit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LectureunitPageRoutingModule
  ],
  declarations: [LectureunitPage]
})
export class LectureunitPageModule {}

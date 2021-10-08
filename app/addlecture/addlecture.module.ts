import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddlecturePageRoutingModule } from './addlecture-routing.module';

import { AddlecturePage } from './addlecture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddlecturePageRoutingModule
  ],
  declarations: [AddlecturePage]
})
export class AddlecturePageModule {}

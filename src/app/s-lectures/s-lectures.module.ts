import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SLecturesPageRoutingModule } from './s-lectures-routing.module';

import { SLecturesPage } from './s-lectures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SLecturesPageRoutingModule
  ],
  declarations: [SLecturesPage]
})
export class SLecturesPageModule {}

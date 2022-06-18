import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateofflinetimePageRoutingModule } from './updateofflinetime-routing.module';

import { UpdateofflinetimePage } from './updateofflinetime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateofflinetimePageRoutingModule
  ],
  declarations: [UpdateofflinetimePage]
})
export class UpdateofflinetimePageModule {}

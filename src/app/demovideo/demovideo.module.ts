import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemovideoPageRoutingModule } from './demovideo-routing.module';

import { DemovideoPage } from './demovideo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemovideoPageRoutingModule
  ],
  declarations: [DemovideoPage]
})
export class DemovideoPageModule {}

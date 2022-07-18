import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartLivePageRoutingModule } from './start-live-routing.module';

import { StartLivePage } from './start-live.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartLivePageRoutingModule
  ],
  declarations: [StartLivePage]
})
export class StartLivePageModule {}

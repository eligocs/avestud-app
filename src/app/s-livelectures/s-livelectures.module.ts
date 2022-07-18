import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SLivelecturesPageRoutingModule } from './s-livelectures-routing.module';

import { SLivelecturesPage } from './s-livelectures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SLivelecturesPageRoutingModule
  ],
  declarations: [SLivelecturesPage]
})
export class SLivelecturesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExrtraclassPageRoutingModule } from './exrtraclass-routing.module';

import { ExrtraclassPage } from './exrtraclass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExrtraclassPageRoutingModule
  ],
  declarations: [ExrtraclassPage]
})
export class ExrtraclassPageModule {}

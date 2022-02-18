import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SExtraclassesPageRoutingModule } from './s-extraclasses-routing.module';

import { SExtraclassesPage } from './s-extraclasses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SExtraclassesPageRoutingModule
  ],
  declarations: [SExtraclassesPage]
})
export class SExtraclassesPageModule {}

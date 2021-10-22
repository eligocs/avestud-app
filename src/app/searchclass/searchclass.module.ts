import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchclassPageRoutingModule } from './searchclass-routing.module';

import { SearchclassPage } from './searchclass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchclassPageRoutingModule
  ],
  declarations: [SearchclassPage]
})
export class SearchclassPageModule {}

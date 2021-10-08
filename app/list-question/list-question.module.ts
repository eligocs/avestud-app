import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListQuestionPageRoutingModule } from './list-question-routing.module';

import { ListQuestionPage } from './list-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListQuestionPageRoutingModule
  ],
  declarations: [ListQuestionPage]
})
export class ListQuestionPageModule {}

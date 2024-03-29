import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component'; 
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { WebrtcService } from '../app/providers/webrtc.service';
/* import { WebrtcService } from '../app/providers/webrtc.service'; */
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ReactiveFormsModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,FormsModule],
  providers: [WebrtcService,AndroidPermissions,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

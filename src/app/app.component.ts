import { Component, VERSION, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PreviousRouteService } from './previous-route.service';
import { StorageService } from './services/storage.service'; 
import { AuthConstants } from '../../config/auth-constants';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  previousUrl: string = null; 
  subs: any;
  token:any;
  constructor(
    private previousRouteService: PreviousRouteService,
    private storageService: StorageService,
  ) {}
  
  async ngOnInit() {     
    var token =  await this.storageService.get(AuthConstants.AUTH)    
    var userdetails =  await this.storageService.get(AuthConstants.userdetails)  
     
    console.log(token && userdetails)
    if(token && userdetails){
      if(userdetails.role == 'institute'){
        this.previousUrl = 'institute';
      }else if(userdetails.role == 'student'){
        this.previousUrl = 'student';
      }
    }else{
      this.previousUrl = '';
    }
  }
  
 
}
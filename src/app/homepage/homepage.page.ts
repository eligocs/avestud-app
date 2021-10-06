import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router } from '@angular/router';
import { PreviousRouteService } from '../previous-route.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit { 
  token:any;
  classes: any;
  access_token: any; 
  showloader: any; 
  previousUrl: any; 
  userData$ = new BehaviorSubject<any>([]);
  constructor(
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService
    ) {  } 
  async ngOnInit() {  
    
    var token =  await this.storageService.get(AuthConstants.AUTH); 
    var mainThis = this; 
      if(!token){
        this.router.navigate(['/']);
      }else{ 
        var classroom =  await this.homeService.getClassRoom(token).subscribe(
          (res: any) => {  
          if (res.data) {
           var result =  res.data;
           var allClasses = [];
            result.forEach((entry) => { 
              entry.subjects.forEach((subj) => { 
                subj.color_code = colorLight();  
              });    
              allClasses.push(entry)
            });    
            this.classes = allClasses;    
          }else{
            mainThis.storageService.removeStorageItem(AuthConstants.AUTH).then(res => { 
              mainThis.router.navigate(['/']);
            });
          }  
        });

      }
        function colorLight() {
          var messages = ["#F9B637", "#1582D2", "#96E601",'#FE8448'];
          var randomColor = messages[Math.floor(Math.random() * messages.length)];
          return randomColor; 
        }  
      /*   function colortop() {
          var messages = ["rgb(140 210 10)", "rgb(245 165 17)", "#0FAFDF",'rgb(173 114 210)'];
          var randomColor = messages[Math.floor(Math.random() * messages.length)];
          return randomColor; 
        }   */

  }
 
  async logoutAction() {   
    this.showloader = true;
    this.storageService.removeStorageItem(AuthConstants.AUTH); 
      this.authService.logout(); 
  }

}

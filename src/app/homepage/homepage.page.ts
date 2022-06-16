import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants'; 
import { PreviousRouteService } from '../previous-route.service';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import { ToastService } from '../services/toast.service'; 
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
  inst_name: any; 
  userData$ = new BehaviorSubject<any>([]);
  constructor(
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private toastService: ToastService
    ) {  } 
  async ngOnInit() {  
    var token =  await this.storageService.get(AuthConstants.AUTH);  
    var userdetails =  await this.storageService.get(AuthConstants.userdetails); 
    var mainThis = this; 
   
    if(!token){
      this.router.navigate(['/']);
    }else{ 
        if(userdetails.role == 'student'){
          mainThis.router.navigate(['/studenthome']);
        }else if(userdetails.role == 'institute'){
          mainThis.router.navigate(['/homepage']);
        }
      var classroom =  await this.homeService.getClassRoom(token).subscribe(
        (res: any) => {  
          if (res.data) {
            var result =  res.data;
            var firstTimeLogin =  res.firstTimeLogin;
            var phone =  res.phone;
            if (firstTimeLogin == 1) {
              this.toastService.presentToast('Update your password before proceeding...'); 
              let navigationExtras: NavigationExtras = {
                queryParams: { 'firstTimeLogin': firstTimeLogin,'phone':phone },
                fragment: 'anchor'
              };
              this.router.navigate(['newpassword'],navigationExtras);
            }
            var allClasses = [];
            result.forEach((entry,i) => { 
              entry.subjects.forEach((subj) => {  
                subj.color_code = colorLight(i);  
              });    
              allClasses.push(entry)
            });    
            this.classes = allClasses;    
            this.inst_name = allClasses[0].institute.name;  
          }else{
            mainThis.storageService.removeStorageItem(AuthConstants.AUTH).then(res => { 
              mainThis.storageService.removeStorageItem(AuthConstants.userdetails); 
              mainThis.router.navigate(['/']);
            });
          }  
        });

      }
        function colorLight(i) {
         /*  var messages = ["#F9B637", "#1582D2", "#96E601",'#FE8448'];
          var randomColor = messages[Math.floor(Math.random() * messages.length)]; */
          var randomColor;
          if(i == 0){
            randomColor =  'orange_gradient_btn';
          }else if(i % 5 == 0){ 
              randomColor =  'pink_btn'; 
          }
          if(i == 1){
            randomColor =  'blue_gradient_btn';
          }
          if(i % 2 == 0){
            randomColor =  'green_gradient_btn';
          }
          if(i % 3 == 0){
            randomColor =  'yellow_gradient_btn';
          } 
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
    this.storageService.removeStorageItem(AuthConstants.Role); 
    this.storageService.removeStorageItem(AuthConstants.userdetails); 
    this.authService.logout(); 
  }

}

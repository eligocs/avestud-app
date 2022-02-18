import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { StudentService } from '../services/student.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router } from '@angular/router';
import { PreviousRouteService } from '../previous-route.service'; 
@Component({
  selector: 'app-studenthome',
  templateUrl: './studenthome.page.html',
  styleUrls: ['./studenthome.page.scss'],
})
export class StudenthomePage implements OnInit {
  token:any; 
  access_token: any; 
  showloader: any; 
  previousUrl: any; 
  studentname: any; 
  showEnrolled: any; 
  allClasses:any;
  constructor(
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private StudentService: StudentService,
    private homeService: HomeService
  ) { }

  async ngOnInit() { 

    var token =  await this.storageService.get(AuthConstants.AUTH);  
    var userdetails =  await this.storageService.get(AuthConstants.userdetails);  
    if(!userdetails){
      window.location.href = '/';
    }
    this.showEnrolled =false;
    this.studentname = userdetails.name ? userdetails.name : '';
    var mainThis = this; 
   
    if(!token){
      this.router.navigate(['/']);
    }else{ 
      if(userdetails.role == 'student'){
        mainThis.router.navigate(['/studenthome']);
      }else if(userdetails.role == 'institute'){
        mainThis.router.navigate(['/homepage']);
      }
      var classroom =  await this.StudentService.studenthome(token).subscribe(
        (res: any) => {   
          if (res.data) { 
            var allClasses = res.data;
            allClasses.institute_assigned_class.forEach((entry,i) => { 
              entry.institute_assigned_class_subject.forEach((entry1,i) => { 
                entry1.color_code = colorLight(i);     
                entry1.color_code2 = colorLight(i);     
              });    
            });    
            this.allClasses =  allClasses; 
            if(allClasses.institute_assigned_class.length > 0){
              this.showEnrolled = true;    
            }
          }else{
             /*  mainThis.storageService.removeStorageItem(AuthConstants.AUTH).then(res => { 
              mainThis.storageService.removeStorageItem(AuthConstants.Role); 
              mainThis.storageService.removeStorageItem(AuthConstants.userdetails);
              mainThis.router.navigate(['/']);
            }); */
          }  
        });
      }
      function colorLight(i) { 
        var items = ['grad_sky','grad_yellow','grad_green','grad_orange','grad_sky']
        return items[Math.floor(Math.random()*items.length)]; 
      }  

  }
  


  async logoutAction() {   
    this.showloader = true;
    this.storageService.removeStorageItem(AuthConstants.Role); 
    this.storageService.removeStorageItem(AuthConstants.AUTH); 
    this.storageService.removeStorageItem(AuthConstants.userdetails); 
    this.authService.logout(); 
  }
}

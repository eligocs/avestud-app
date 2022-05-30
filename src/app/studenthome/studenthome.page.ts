import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { StudentService } from '../services/student.service';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants'; 
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
  categories:any;
  selected_cat:any;

  constructor(
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private StudentService: StudentService,
    private homeService: HomeService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() { 

    var token =  await this.storageService.get(AuthConstants.AUTH);  
    var userdetails =  await this.storageService.get(AuthConstants.userdetails);  
    if(!userdetails){
      window.location.href = '/';
    }else{  
      await this.StudentService.getcats(token).subscribe(
        (res: any) => {  
          if (res.categories) { 
            this.categories =  res.categories;  
          }
        }) 
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
    }
    if(token){
      this.loadData(token);
      console.log('yes')  
    }
     

  }
  
  async loadData(token){
   
    var classroom =  await this.StudentService.studenthome(token).subscribe(
      (res: any) => {   
        console.log(res.data)
        if (res.data) { 
          var allClasses = res.data; 
          if(allClasses){ 
            allClasses.institute_assigned_class.forEach((entry,i) => { 
              entry.institute_assigned_class_subject.forEach((entry1,i) => { 
                entry1.color_code = colorLight(i);     
                entry1.color_code2 = colorLight(i);     
              });    
            });    
            this.allClasses =  allClasses; 
          } 
          if(allClasses.institute_assigned_class.length == 0){
            let navigationExtras: NavigationExtras = {
              queryParams: {'selected_cat':1},
              fragment: 'anchor'
            };
            this.router.navigate(['searchclass'],navigationExtras);
            this.showEnrolled =false;
          }else{
            this.showEnrolled =true;
          }
        } 
      });
      function colorLight(i) { 
        var items = ['grad_sky','grad_yellow','grad_green','grad_orange','grad_sky']
        return items[Math.floor(Math.random()*items.length)]; 
      }  
  }
  
  oncatChange(){ 
    let navigationExtras: NavigationExtras = {
      queryParams: {'selected_cat':this.selected_cat},
      fragment: 'anchor'
    };
    this.router.navigate(['searchclass'],navigationExtras);
  }

  async logoutAction() {   
    this.showloader = true;
    this.storageService.removeStorageItem(AuthConstants.Role); 
    this.storageService.removeStorageItem(AuthConstants.AUTH); 
    this.storageService.removeStorageItem(AuthConstants.userdetails); 
    this.authService.logout(); 
  }
}

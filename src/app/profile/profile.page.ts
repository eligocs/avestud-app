import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';  
import { ToastService } from '../services/toast.service';  
import { StudentService } from '../services/student.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  postData = {
    profile:'',
    name:'',
    phone:'',
    board:'',
    date_of_birth:'',
    gender:'',
    state:'',
    city:'',
    grade:'',
    avatar:'',
  }
  olddata:any;
  showloader:boolean;
  institute:any; 
  student:any; 
  iacs:any; 
  subject:any; 
  previousUrl:any; 
  avatar:any; 
  constructor( private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private toastService: ToastService) { }

    async ngOnInit() { 
      this.olddata = {}; 
      this.previousUrl = 'homepage';    
      var token =  await this.storageService.get(AuthConstants.AUTH)  
      await this.homeService.profile(token).subscribe(
        (res: any) => {    
          if(res.status == 200){  
            this.institute = res.institute ? res.institute :'';    
            this.student = res.student ? res.student :'';    
            this.postData.name = res.student.name ? res.student.name :'';    
            this.postData.phone = res.student.phone ? res.student.phone :'';    
            this.postData.board = res.student.board ? res.student.board :'';  
            this.postData.date_of_birth = res.student.date_of_birth ? res.student.date_of_birth :'';  
            this.postData.gender = res.student.gender ? res.student.gender :'';  
            this.postData.state = res.student.state ? res.student.state :'';  
            this.postData.city = res.student.city ? res.student.city :'';  
            this.postData.grade = res.student.grade ? res.student.grade :'';   
            this.avatar = res.student.avatar ? res.student.avatar :''; 
            console.log(this.postData.date_of_birth)  
          }  
        });
    }
    onChangefile(event) { 
      this.postData.avatar = event.target.files[0]; 
  }
    async updateprofile(){
      this.showloader = true;
      var newData = {
        name : this.postData.name,
        phone : this.postData.phone,
        board : this.postData.board,
        date_of_birth : this.postData.date_of_birth,
        gender : this.postData.gender, 
        state : this.postData.state, 
        city : this.postData.city, 
        grade : this.postData.grade,  
        avatar : this.postData.avatar,  
      }  
      
      if(newData){
        var token =  await this.storageService.get(AuthConstants.AUTH)   
        var classid= this.iacs; 
          await this.studentService.updateprofile(newData,token).subscribe(
            (res: any) => {    
              if (res.status == 200) {
                this.toastService.presentToast(res.msg);  
                setTimeout(()=>{
                  window.location.reload();
                },2000);
              }else{
                this.toastService.presentToast('Fail to update details !!!'); 
              }
            }
          );
        }
    }
    
  

}

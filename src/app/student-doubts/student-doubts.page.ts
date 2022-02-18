import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { StudentService } from '../services/student.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants'; 
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';  
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-student-doubts',
  templateUrl: './student-doubts.page.html',
  styleUrls: ['./student-doubts.page.scss'],
})
export class StudentDoubtsPage implements OnInit {
  subject:any;
  iacs:any;
  previousUrl:any;
  doubt:any;
  doubtfile:any;
  text_message:any;
  student:any;
  messages:any;
  showloader:boolean;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { } 

  async ngOnInit() {
    setTimeout(() => {
      this.scrollToElement()  
    }, 1500);
    var token =  await this.storageService.get(AuthConstants.AUTH);  
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];  
        this.doubt =  params['doubt'];  
        if(this.iacs && this.subject){
          this.previousUrl = 'subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1';  
          this.loadstudentDoubt(this.iacs,this.doubt,token);
        }
      });
  }
  scrollToElement() {
    document.getElementById("text_input").scrollIntoView();
  }
  async send_btn(){ 
    this.showloader = true;
    var mainthis= this;  
    if(this.doubtfile){
      var _msg = this.doubtfile;
      var type = 'file';
    }  
    if(this.text_message){
      var _msg = this.text_message;
      var type = 'text';
    }  
    var newData = {
      message : _msg, 
      doubt : this.doubt,
      iacs : this.iacs, 
      student_id : this.student,
      type : type
    }      
    if(newData){
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var classid= this.iacs;
        await this.studentService.send_btn(newData,token).subscribe(
          (res: any) => {    
            if (res.status == 200) {  
              this.toastService.presentToast(res.msg); 
              mainthis.loadstudentDoubt(newData.iacs,newData.doubt,token);
              this.text_message = '';
              this.scrollToElement()  
            }else{
              this.toastService.presentToast(res.msg); 
            }
            this.showloader = false;
          }
        );
      }
  }

  onChange(event) {
    this.doubtfile = event.target.files[0]; 
    this.send_btn();
  }

  async reloadpage(event) {
    var token =  await this.storageService.get(AuthConstants.AUTH)   
    this.loadstudentDoubt(this.iacs,this.doubt,token);
    this.scrollToElement()  
  }

  async loadstudentDoubt(iacs,doubt,token){
    this.showloader = true;
    var token =  await this.storageService.get(AuthConstants.AUTH)  
    var data ={
      iacs:iacs,
      doubt:doubt
    }
    
    await this.studentService.loadstudentDoubt(data,token).subscribe(
      (res: any) => {   
        if (res.status == 200) {
          console.log(res)
          this.student = res.student;
          this.doubt = res.messages.length > 0 ? res.messages[0].doubt_id :'';
          this.messages = res.messages.length > 0 ? res.messages:''; 
        }
        this.scrollToElement()  
        this.showloader = false;
      }); 
  }

}

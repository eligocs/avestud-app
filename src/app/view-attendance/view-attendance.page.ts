import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import { ToastService } from '../services/toast.service'; 
import $ from 'jquery';
@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.page.html',
  styleUrls: ['./view-attendance.page.scss'],
})
export class ViewAttendancePage implements OnInit {
  previousUrl:any;
  iacs:any;
  subject:any;
  allsubjects:any;
  student:any;
  selected_sub:any;
  responseHTML:any;
  total_past_lectures:any;
  attended_lectures:any;
  total_attended_lectures:any;
  total_absents_in_lectures:any;
  percentage:any;
  attended_lectures_dates:any;
  absentLectureDates:any;
  notAvailable:any;
  studentName :any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  async ngOnInit() {

    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];     
        this.student =  params['student'];     
        this.studentName =  params['studentName'];     
        if(this.iacs && this.subject){ 
            this.previousUrl = 'enrollments?iacs='+this.iacs+'&subject='+this.subject;   
            this.getStudentSubjects(this.iacs , this.student,this.subject);
        }  
      }
    )  

  }

  async onSubChange(){ 
    var token =  await this.storageService.get(AuthConstants.AUTH);  
    if(this.selected_sub){
      var data = {
        subject:this.selected_sub,
        student:this.student,
        iacs:this.iacs, 
      }
      await this.homeService.getstudentAttendance(data,token).subscribe(
      (res: any) => {  
        if (res.status == 200) {      
            this.total_past_lectures = res.total_past_lectures ?? 0;
            this.attended_lectures = res.attended_lectures ?? 0;
            this.total_attended_lectures = res.total_attended_lectures ?? 0;
            this.total_absents_in_lectures = res.total_absents_in_lectures ?? 0;
            this.percentage = res.percentage ?? 0;
            this.attended_lectures_dates = res.attended_lectures_dates ?? 0;
            this.absentLectureDates = res.absent_lectures_dates ?? 0;
            this.notAvailable = res.not_available ?? 0; 
        }
      }) 
    } 
  }

  async getStudentSubjects(iacs,student,subject){
    if(iacs && student){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
      var data = {
        iacs:iacs, 
        student:student,
        subject:subject
      }
          await this.homeService.getStudentSubjects(data,token).subscribe(
            (res: any) => {     
              if (res.status == 200) { 
                this.allsubjects = res.options;    
              }else{
                this.toastService.presentToast('Something went wrong,try again later'); 
              }
            }
          );
    }

  }

}

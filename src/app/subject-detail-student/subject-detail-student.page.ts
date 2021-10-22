import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service'; 
import { PreviousRouteService } from '../previous-route.service';
import { AuthConstants } from '../../../config/auth-constants';
import { ToastService } from '../services/toast.service';
import { AlertController } from '@ionic/angular'; 
@Component({
  selector: 'app-subject-detail-student',
  templateUrl: './subject-detail-student.page.html',
  styleUrls: ['./subject-detail-student.page.scss'],
})
export class SubjectDetailStudentPage implements OnInit {
  i_a_c_s_id:number;
  getSubjectsInfo:any;
  doubtsnotify:number;
  class_days:any;
  iac:any;
  teacher:any;
  lecture_dates:any;
  subject:any;
  iacs:any;
  video:any;
  previousUrl:any;  
  subjectname:any;  
  notificat:any; 
  loadsuccess:any; 
  syllabus:string; 
  istudent:string; 
  purchased:any; 
  class_time:any; 
  showteacher:any;
  constructor(
    private previousRouteService: PreviousRouteService,
    private router: Router,
    public alertController: AlertController,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }


  async ngOnInit() {
    this.doubtsnotify = 0; 
    this.purchased = 2; 
    this.previousUrl = '/searchclass';  
    var token =  await this.storageService.get(AuthConstants.AUTH)  
    await this.storageService.get(AuthConstants.AUTH)   
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];
        this.subject = params['subject']; 
        this.purchased = params['purchased'];
        if(this.purchased){
          this.previousUrl = '/studenthome'; 
        } 
        if(this.subject && this.iacs && token){ 
            this.loadstudentdata(this.iacs,this.subject,token);  
        }
      }
    ) 
  }
  async loadstudentdata(iacs,subject,token){ 
    if(this.iacs && this.subject){
        if(this.iacs && this.subject){
          await this.homeService.loadstudentdata(iacs,subject,token).subscribe(
            (res: any) => {       
              if(res.status == 200){
                this.syllabus = res.data.syllabus !='' ? res.data.syllabus:'';
                this.getSubjectsInfo = res.getSubjectsInfo ? res.getSubjectsInfo:'';
                this.iac = res.iac ? res.iac:''; 
                this.subjectname = res.subject ? res.subject:''; 
                this.i_a_c_s_id = res.i_a_c_s_id ? res.i_a_c_s_id:'';   
                this.teacher = res.teacher ? res.teacher:''; 
                this.class_time = res.class_time ? res.class_time:''; 
                this.video = res.data.video ? res.data.video:'';
                console.log(this.class_time[0] )
              }
             /* 
              this.doubtsnotify = res.data.doubtsnotify ? res.data.doubtsnotify:0;   
               */
            });
        }   
    }
  }


}

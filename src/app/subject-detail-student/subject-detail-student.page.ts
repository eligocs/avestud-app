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
  mode_of_class:any; 
  syllabus:string; 
  istudent:string; 
  purchased:any; 
  class_time:any; 
  showteacher:any;
  description:any;
  selected_cat:any;
  dnotifications:any;
  notifications:any;
  assignmentnotifications:any;
  testsnotification:any;
  extranotifications:any;
  next_class:any;
  toatalmarks:any;
  total_unattempted:any;
  total_attempted:any; 
  student_subjects_info_id:any;
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
        this.selected_cat = params['selected_cat'];
        if(this.purchased){
          this.previousUrl = '/studenthome'; 
        } 
        if(this.selected_cat){
          this.previousUrl = '/searchclass?selected_cat='+this.selected_cat; 
        } 
        if(this.subject && this.iacs && token){ 
            this.loadstudentdata(this.iacs,this.subject,token);  
        }
      }
    ) 
   
 /*    setInterval(()=> { 
      this.updatenotification();
    }, 5 * 1000); */
  }
  colorLight() { 
    var items = ['bg_gradient_skyblue','bg_gradient_orange','bg_gradient_green','bg_gradient_yellow']
    return items[Math.floor(Math.random()*items.length)]; 
  } 
   colorLight2() { 
    var items = ['skyblue_gradient','orange_gradient','green_gradient','yellow_gradient']
    return items[Math.floor(Math.random()*items.length)]; 
  }  

  async updatenotification(){
    var token =  await this.storageService.get(AuthConstants.AUTH)  
    if(this.iacs && this.subject){
      if(this.iacs && this.subject){
        await this.homeService.loadstudentdata(this.iacs,this.subject,token).subscribe(
          (res: any) => {     
            if(res.status == 200){
              this.notifications = res.notifications ? res.notifications:0; 
              this.assignmentnotifications = res.assignmentnotifications ? res.assignmentnotifications:0;    
              this.dnotifications = res.dnotifications ? res.dnotifications:0;   
              this.testsnotification = res.testsnotification ? res.testsnotification:0;  
              this.extranotifications = res.extranotifications ? res.extranotifications:0;     
            }
          })
        }
      }
  }

  async loadstudentdata(iacs,subject,token){ 
    if(this.iacs && this.subject){
        if(this.iacs && this.subject){
          await this.homeService.loadstudentdata(iacs,subject,token).subscribe(
            (res: any) => {     
              if(res.status == 200){
                this.total_attempted = res.total_attempted ? res.total_attempted:0;
                this.total_unattempted = res.total_unattempted  ? res.total_unattempted:0;
                this.toatalmarks = res.toatalmarks ? res.toatalmarks:0;
                this.syllabus = res.syllabus !='' ? res.syllabus:'';
                this.mode_of_class = res.mode_of_class !='' ? res.mode_of_class:'';
                this.getSubjectsInfo = res.getSubjectsInfo ? res.getSubjectsInfo:'';
                this.iac = res.iac ? res.iac:''; 
                this.subjectname = res.subject ? res.subject:'';  
                this.i_a_c_s_id = res.i_a_c_s_id ? res.i_a_c_s_id:'';   
                this.teacher = res.teacher ? res.teacher:''; 
                this.class_time = res.class_time ? res.class_time:''; 
                this.video = res.video ? res.video:'';  
                this.notifications = res.notifications ? res.notifications:0; 
                this.assignmentnotifications = res.assignmentnotifications ? res.assignmentnotifications:0;    
                this.dnotifications = res.dnotifications ? res.dnotifications:0;   
                this.testsnotification = res.testsnotification ? res.testsnotification:0;  
                this.extranotifications = res.extranotifications ? res.extranotifications:0;    
                this.next_class = res.next_class ? res.next_class:'';  
                var allclasses = res.class_days ? res.class_days:''; 
                this.description = res.description ? res.description:''; 
                this.student_subjects_info_id =  res?.student_subjects_info_id ?? '';
                var classArr = []; 
                if(allclasses){
                    for(var i=0;i<allclasses.length;i++){
                      classArr.push({
                          day: allclasses[i], 
                          color:  this.colorLight(),
                          color2:  this.colorLight2()
                      });
                    }   
                  this.class_days = classArr;   
                }   
              } 
            });
        }   
    }
  }


}

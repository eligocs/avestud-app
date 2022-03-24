import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service'; 
import { PreviousRouteService } from '../previous-route.service';
import { AuthConstants } from '../../../config/auth-constants';
import { ToastService } from '../services/toast.service';
import { AlertController } from '@ionic/angular'; 
 

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.page.html',
  styleUrls: ['./subject-detail.page.scss'],
})
export class SubjectDetailPage implements OnInit {
  i_a_c_s_id:number;
  getSubjectsInfo:any;
  doubtsnotify:number;
  class_days:any;
  next_class:any;
  iac:any;
  video:any;
  lecture_dates:any;
  subject:any;
  iacs:any;
  previousUrl:any;
  subject_id:any;  
  notificat:any; 
  loadsuccess:any; 
  syllabus:string; 
  istudent:string; 
  showloader:boolean;
  syllabusSelected:string; 
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
    this.previousUrl = '/homepage'; 
    var token =  await this.storageService.get(AuthConstants.AUTH)  
    await this.storageService.get(AuthConstants.AUTH)   
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];
        this.subject_id = params['subject'];
        this.istudent = params['istudent']; 
       
        if(this.subject_id && this.iacs && token){
          /* if(this.istudent){
            this.loadstudentdata(this.iacs,this.subject_id,token); 
          }else{ */ 
            this.loaddata(this.iacs,this.subject_id,token); 
         /*  } */
        }
      }
    ) 
    

  }

  async onChange(event) {
    this.showloader = true;
    var token =  await this.storageService.get(AuthConstants.AUTH)   
      if(event.target.files[0]) {
        var newData = {
          syllabus : event.target.files[0], 
          i_assigned_class_subject_id:this.iacs
        }  
        await this.homeService.saveSyllabus(newData,token).subscribe(
          (res: any) => {     
            this.showloader = false;
            if(res.status == 200){ 
              window.location.href = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject_id; 
            }
            this.toastService.presentToast(res.msg); 
          })
        } 
    } 

  async setText(e) { 
    if(this.notificat){
      var notifytext = this.notificat;
      var iacs = this.iacs; 
      if(iacs && notifytext){
        var token =  await this.storageService.get(AuthConstants.AUTH)   
        var classid= this.iacs;
        var newData = {
          notifytext:notifytext,
          iacs:iacs,
          type:'text',
        } 
          await this.homeService.creatnotify(newData,token).subscribe(
            (res: any) => {     
              this.toastService.presentToast('Class Notification Created Successfully'); 
              this.notificat = '';
             /*  this.loadsuccess = res.msg;
              setTimeout(() => {
                this.loadsuccess = '';
              }, 5000); */
            })
          } 
    }

  }

  

  
  async loaddata(iacs,subject_id,token){  
    if(this.iacs && this.subject_id){
        if(this.iacs && this.subject_id){
          await this.homeService.openSubject(iacs,subject_id,token).subscribe(
            (res: any) => {    
              this.syllabus = res.data.syllabus ? res.data.syllabus:'';
              this.video = res.data.video ? res.data.video:'';
              this.getSubjectsInfo = res.data.getSubjectsInfo ? res.data.getSubjectsInfo:'';
              this.doubtsnotify = res.data.doubtsnotify ? res.data.doubtsnotify:0;
              this.class_days = res.data.class_days ? res.data.class_days:'';
              this.iac = res.data.iac ? res.data.iac:'';
              this.lecture_dates = res.data.lecture_dates ? res.data.lecture_dates:'';
              this.subject = res.data.subject ? res.data.subject:'';  
              this.i_a_c_s_id = res.data.i_a_c_s_id ? res.data.i_a_c_s_id:'';    
              this.next_class = res.data.next_class ? res.data.next_class:''; 
              console.log(this.video)
            });
        }   
    }
  }

}

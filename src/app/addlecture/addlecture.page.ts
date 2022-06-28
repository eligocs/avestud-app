import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import * as $ from 'jquery';
import { HttpEvent, HttpEventType } from '@angular/common/http';
/* import 'select2';                      
import 'select2/dist/css/select2.css'; */
import { AlertController  } from '@ionic/angular';  
import { ToastService } from '../services/toast.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
@Component({
  selector: 'app-addlecture',
  templateUrl: './addlecture.page.html',
  styleUrls: ['./addlecture.page.scss'],
})
export class AddlecturePage implements OnInit {
  postData = {
    unit: '',
    number: '',
    lecturename: '',
    date: '',  
    old_id: '',  
    time: '',  
    duration: '',  
    islive: '',  
  };
  notes:File=null;
  video:File=null;
  units:any;
  showloader:boolean;
  subject:any;
  progress:any;
  iacs:any;
  previousUrl:any;
  olddata:any;
  lectureid:any; 
  liveunits:any; 
  type:any; 
  progressPercent:any; 
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    public alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    this.olddata = {}; 
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs']; 
        this.subject =  params['subject']; 
        this.lectureid =  params['lectureid'];  
        this.type =  params['type'];  
        if(this.iacs && this.subject){
          if(this.type == 'live'){
            this.previousUrl = 'liveclasses?iacs='+this.iacs+'&subject='+this.subject;  
          }else{
            this.previousUrl = 'lectures?iacs='+this.iacs+'&subject='+this.subject;  
          }
        }
        if(this.lectureid){
          this.getOlddata(this.lectureid);
        }else{
          this.olddata = {}; 
          this.postData = {
            unit: '',
            number: '',
            lecturename: '',
            date: '',  
            old_id: '',  
            time: '',  
            duration: '', 
            islive: '', 
          };
          this.showloader = false;
        }
      }
    ) 
     
    var classid= this.iacs; 
    if(this.iacs && this.type == 'live'){
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var classroom =  await this.homeService.getLiveunits(classid,token).subscribe(
        (res: any) => { 
          if (res) { 
            this.liveunits = res.data;   
          } 
        });
    }else{ 
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var classroom =  await this.homeService.getClassunits(classid,token).subscribe(
        (res: any) => { 
          if (res) {
            this.units = res.data;   
          } 
        });
    } 
    

  }
  async getOlddata(id) {
    this.showloader = false; 
    if(id){
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var lectureid= id; 
      var classroom =  await this.homeService.getLecture(lectureid,token).subscribe(
      (res: any) => { 
        if (res) { 
          this.olddata = res.data;  
          console.log(this.olddata)
          this.postData.unit = res.data.unit_id ? res.data.unit_id : '';  
        } 
      });
    }
    this.showloader = false;
  }
  onChange(event) {
      this.notes = event.target.files[0]; 
  }
  onChangeVideo(event) { 
      this.video = event.target.files[0]; 
  }
  async createLecture(){
    this.progressPercent =  0 ;
    this.showloader = true;
    if(this.postData.unit == ''){
      this.toastService.presentToast('Please select unit !!!'); 
      this.showloader = false;
      return false;
    }
    if(this.postData.number == ''){
      this.toastService.presentToast('Lecture number is required !!!'); 
      this.showloader = false;
      return false;
    }
    if(this.postData.lecturename == ''){
      this.toastService.presentToast('Lecture name is required !!!'); 
      this.showloader = false;
      return false;
    }
    if(this.postData.date == ''){
      this.toastService.presentToast('Lecture date is required !!!'); 
      this.showloader = false;
      return false;
    }
    var newData = {};
    if(this.iacs && this.type == 'live'){
      newData = { 
        unit : this.postData.unit,
        number : this.postData.number,
        lecturename : this.postData.lecturename,
        old_id : this.lectureid,
        date : this.postData.date, 
        time : this.postData.time, 
        duration : this.postData.duration, 
        type : this.type,
        i_assigned_class_subject_id:this.iacs
      }
    }else if(this.iacs && this.type == ''){
      newData = {
        unit : this.postData.unit,
        number : this.postData.number,
        lecturename : this.postData.lecturename,
        old_id : this.lectureid,
        date : this.postData.date,
        notes : this.notes,
        video : this.video,
        type : this.type,
        i_assigned_class_subject_id:this.iacs
      }  
    } 
    if(newData){
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var classid= this.iacs; 
      if(classid){
        await this.homeService.createLecture(newData,token).subscribe((event: HttpEvent<any>) => { 
          switch (event.type) {
            case HttpEventType.Sent:
               
              break;
            case HttpEventType.ResponseHeader: 
              break;
            case HttpEventType.UploadProgress:
              var prog = Math.round(event.loaded / event.total * 100);
              if(prog > 97){
                prog = 98;
              }  
                this.progress =  prog /100;
                this.progressPercent =  prog ; 
              break;
            case HttpEventType.Response:
              this.progress = 100; 
              setTimeout(() => {
                var res = event.body;
                if (res.status == 200) {
                  this.toastService.presentToast(res.msg); 
                  let navigationExtras: NavigationExtras = {
                    queryParams: { 'iacs': this.iacs,'subject':this.subject },
                    fragment: 'anchor'
                  };
                  this.router.navigate(['liveclasses'],navigationExtras);
                }else if(res.status == 205){
                  this.showloader = false;
                  this.progress = 0;
                  this.toastService.presentToast('Please select unit !!!'); 
                }else{
                  this.toastService.presentToast('Fail to add lecture!!!'); 
                } 
              }, 1500);
          } 
        }) 
      }
            /* if (res.status == 200) {
              this.toastService.presentToast(res.msg); 
              let navigationExtras: NavigationExtras = {
                queryParams: { 'iacs': this.iacs },
                fragment: 'anchor'
              };
              this.router.navigate(['lectures'],navigationExtras);
            }else{
              this.toastService.presentToast('Fail to add lecture!!!'); 
            } */
          }
    }
    setPercentBar(i) {
      setTimeout(() => {
        let apc = (i / 100) 
       // this.progress = apc;
        //this.progressPercent = i;
      }, 30 * i);
    }

  ngAfterViewInit(){
    $(document).ready(function(){
    });
  }

}

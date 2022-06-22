import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import * as $ from 'jquery'; 
import { ToastService } from '../services/toast.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-add-extra-class',
  templateUrl: './add-extra-class.page.html',
  styleUrls: ['./add-extra-class.page.scss'],
})
export class AddExtraClassPage implements OnInit {
  postData = {
    unit: '',
    number: '',
    lecturename: '',
    date: '',  
    old_id: '',  
  };
  progressPercent:any;
  progress:any;
  notes:File=null;
  video:File=null;
  units:any;
  iacs:any;
  previousUrl:any;
  olddata:any;
  lectureid:any;
  subject:any;
  showloader:boolean;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  async ngOnInit() {  
    $('#notes').value = '';
   $(document).ready(function(){
    $('#video').val('');
   });
    this.olddata = {};  
    var token =  await this.storageService.get(AuthConstants.AUTH)   
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs']; 
        this.subject =  params['subject']; 
        this.lectureid =  params['lectureid']; 
        if(this.iacs,this.subject){
          this.previousUrl = 'extraclass?iacs='+this.iacs+'&subject='+this.subject; 
        } 
        if(this.lectureid){
          this.getoldlecture(this.lectureid);
        }else{
          this.olddata = {}; 
          this.postData = {
            unit: '',
            number: '',
            lecturename: '',
            date: '',  
            old_id: '',
          };
        }
      }
    ) 
    if(this.iacs){
      var classid= this.iacs;
      var classroom =  await this.homeService.getClassunits(classid,token).subscribe(
      (res: any) => { 
        if (res) {
          this.units = res.data;    
        } 
      });
    }
   
    
  }

  async getoldlecture(id){
    this.showloader = false; 
    var token =  await this.storageService.get(AuthConstants.AUTH)   
    if(id){ 
      var lectureid= id; 
      var classroom =  await this.homeService.getExtraClass(lectureid,token).subscribe(
      (res: any) => { 
        if (res) { 
          this.olddata = res.data;   
          this.postData.unit = res.data.unit_id ?? '';           
          //this.postData = res.data;    
        } 
      });
    }
  }

  onChange(event) {
      this.notes = event.target.files[0];   
  }
  onChangeVideo(event) { 
      this.video = event.target.files[0]; 
  }
  async createExtraClass(){
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
    var newData = {
      unit : this.postData.unit,
      number : this.postData.number,
      lecturename : this.postData.lecturename,
      old_id : this.lectureid,
      date : this.postData.date,
      notes : this.notes,
      video : this.video,
      i_assigned_class_subject_id:this.iacs
    }   
    var token =  await this.storageService.get(AuthConstants.AUTH)   
    if(newData && token){
      var classid= this.iacs;
        await this.homeService.createExtraClass(newData,token).subscribe((event: HttpEvent<any>) => {   
          switch (event.type) {
            case HttpEventType.Sent:
              var progressPercent = 2;  
              break;
            case HttpEventType.ResponseHeader: 
              break;
            case HttpEventType.UploadProgress:
              var prog = Math.round(event.loaded / event.total * 100);
              if(prog > 95){
                prog = 95;
              } 
               /*  for (let index = 0; index <= 90; index++) {
                  this.setPercentBar(+index);
                } */
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
                  this.router.navigate(['extraclass'],navigationExtras);
                }else if(res.status == 205){
                  this.showloader = false;
                  this.progress = 0;
                  this.toastService.presentToast('Please select unit !!!'); 
                }else{
                  this.toastService.presentToast('Fail to add extra class!!!'); 
                } 
              }, 1500);
          } 
           /*  if (res.status == 200) {
              this.toastService.presentToast(res.msg);   
              window.location.href = 'extraclass?iacs='+this.iacs+'&subject='+this.subject; 
            }else{
              this.toastService.presentToast('Fail to add extra class !!!'); 
            } */
          }
        );
    }
  }

  setPercentBar(i) {
    setTimeout(() => {
      let apc = (i / 100) 
      /* this.progress = apc;
      this.progressPercent = i; */
    }, 30 * i);
  }

}

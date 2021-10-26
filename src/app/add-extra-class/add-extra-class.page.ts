import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import * as $ from 'jquery';
import 'select2';                      
import 'select2/dist/css/select2.css';
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
  notes:File=null;
  video:File=null;
  units:any;
  iacs:any;
  previousUrl:any;
  olddata:any;
  lectureid:any;
  subject:any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
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
    var token =  await this.storageService.get(AuthConstants.AUTH)   
    if(id){ 
      var lectureid= id; 
      var classroom =  await this.homeService.getExtraClass(lectureid,token).subscribe(
      (res: any) => { 
        if (res) { 
          this.olddata = res.data;      
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
        await this.homeService.createExtraClass(newData,token).subscribe(
          (res: any) => {    
            if (res.status == 200) {
              this.toastService.presentToast(res.msg);   
              window.location.href = 'extraclass?iacs='+this.iacs+'&subject='+this.subject; 
            }else{
              this.toastService.presentToast('Fail to add extra class !!!'); 
            }
          }
        );
    }
  }

}

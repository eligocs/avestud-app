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
  };
  notes:File=null;
  video:File=null;
  units:any;
  subject:any;
  iacs:any;
  previousUrl:any;
  olddata:any;
  lectureid:any; 
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
        this.lectureid =  params['lectureid'];  
        if(this.iacs && this.subject){
          this.previousUrl = 'lectures?iacs='+this.iacs+'&subject='+this.subject;  
        }
        if(this.lectureid){
          this.getOlddata(this.lectureid);
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
    var token =  await this.storageService.get(AuthConstants.AUTH)   
    var classid= this.iacs;
    var classroom =  await this.homeService.getClassunits(classid,token).subscribe(
      (res: any) => { 
        if (res) {
          this.units = res.data;   
        } 
      });
    } 
    

  }
  async getOlddata(id) {
    if(id){
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var lectureid= id; 
      var classroom =  await this.homeService.getLecture(lectureid,token).subscribe(
      (res: any) => { 
        if (res) { 
          this.olddata = res.data;  
          this.postData.unit = res.data.unit_id ? res.data.unit_id : '';  
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
  async createLecture(){
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
    
    if(newData){
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var classid= this.iacs;
        await this.homeService.createLecture(newData,token).subscribe(
          (res: any) => {    
            if (res.status == 200) {
              this.toastService.presentToast(res.msg); 
              let navigationExtras: NavigationExtras = {
                queryParams: { 'iacs': this.iacs },
                fragment: 'anchor'
              };
              this.router.navigate(['lectures'],navigationExtras);
            }else{
              this.toastService.presentToast('Fail to add lecture!!!'); 
            }
          }
        );
      }
  }

  ngAfterViewInit(){
    $(document).ready(function(){
    });
  }

}

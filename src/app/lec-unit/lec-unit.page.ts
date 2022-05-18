import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import 'select2';                      
import 'select2/dist/css/select2.css';
import { ToastService } from '../services/toast.service';     
@Component({
  selector: 'app-lec-unit',
  templateUrl: './lec-unit.page.html',
  styleUrls: ['./lec-unit.page.scss'],
})
export class LecUnitPage implements OnInit {
  postData = {
    unitName:''
  }
  iacs:any;
  units:any;
  subject:any; 
  type:any; 
  previousUrl:any; 
  constructor( private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];  
        this.type =  params['type']; 
        if(this.iacs && this.subject){
          if(this.type == 'extraclass'){
            this.previousUrl = 'extraclass?iacs='+this.iacs+'&subject='+this.subject;  
          }else{
            this.previousUrl = 'lectures?iacs='+this.iacs+'&subject='+this.subject;   
          }
        } 
      }
    ) 
  }

  
  async createTestUnit(){
    var newData = {
      name : this.postData.unitName, 
      i_assigned_class_subject_id : this.iacs, 
    }     
   
    if(newData){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
        await this.homeService.createLectureUnit(newData,token).subscribe(
          (res: any) => {    
            if (res.status == 200) {
              this.toastService.presentToast(res.msg);  
              setTimeout(() => {
                if(this.type == 'extraclass'){
                  window.location.href = 'extraclass?iacs='+this.iacs+'&subject='+this.subject;
                }else{
                  window.location.href = 'lectures?iacs='+this.iacs+'&subject='+this.subject;
                }
              }, 2000);
            }else{
              this.toastService.presentToast(res.msg); 
            }
          }
        );
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { PreviousRouteService } from '../previous-route.service';  
import { ToastService } from '../services/toast.service';  
import { AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-s-test',
  templateUrl: './s-test.page.html',
  styleUrls: ['./s-test.page.scss'],
})
export class STestPage implements OnInit {
  showUnitFor:'';
  iacs:string;
  subject:string;
  previousUrl:string;
  testAll:any; 
  testWithoutClass:any; 
  noTest:boolean; 
  hideOlds:boolean; 
  nodata:boolean; 
  type:boolean; 
  constructor(
      private previousRouteService: PreviousRouteService,
      private storageService: StorageService,
      private homeService: HomeService,
      private route: ActivatedRoute,
      public alertCtrl: AlertController,
      private toastService: ToastService
  ) { }

  async ngOnInit() { 
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];  
        this.type =  params['type'];  
        this.getTests(this.iacs,token);
        if(this.iacs && this.subject){
          this.previousUrl = 'subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1';  
        }
      }
    )
  }
  toggleShow(unit) {
    if(unit){
      this.showUnitFor = unit;
    }else{
      this.showUnitFor = '';
    } 
  }
  async getTests(iacs,token){
    if(iacs && token){    
      await this.homeService.getSTests(iacs,token).subscribe(
        (res: any) => {     
          if(res.status == 200){
            this.testAll = res.topics ? res.topics:{};  
            this.testWithoutClass = res.assignmet_w_n_t ? res.assignmet_w_n_t:{};  
            if(this.testAll.length > 0){
              this.hideOlds = true;
              this.nodata = false;
            }else{
              this.nodata = true;
              this.hideOlds = false;
            }      
          }else{
            this.testAll = {};   
            this.testWithoutClass = {};  
            this.noTest = true; 
            this.nodata = true;
            this.hideOlds = false;  
          } 
      }); 
    }  
  }


}

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
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  iacs:string;
  subject:string;
  previousUrl:string;
  testAll:any; 
  noTest:boolean; 
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
        this.getTests(this.iacs,token);
        this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject;  
      }
    )
  }

  async getTests(iacs,token){
    if(iacs && token){    
      await this.homeService.getTests(iacs,token).subscribe(
        (res: any) => {    
          if(res.status == 200){
            this.testAll = res.topics ? res.topics:'';  
          }else{
            this.testAll = [];   
            this.noTest = true;   
          }
      }); 
    }  
  }

}

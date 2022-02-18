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
  showUnitFor:'';
  iacs:string;
  subject:string;
  previousUrl:string;
  testAll:any; 
  testWithoutClass:any; 
  noTest:boolean; 
  hideOlds:boolean; 
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
  toggleShow(unit) {
    if(unit){
      this.showUnitFor = unit;
    }else{
      this.showUnitFor = '';
    } 
  }
  async getTests(iacs,token){
    if(iacs && token){    
      await this.homeService.getTests(iacs,token).subscribe(
        (res: any) => {     
          if(res.status == 200){
            this.testAll = res.topics ? res.topics:{};  
            this.testWithoutClass = res.assignmet_w_n_t ? res.assignmet_w_n_t:{};  
            if(this.testWithoutClass.length > 0){
              this.hideOlds = true;
            }else{
              this.hideOlds = false;
            }     
            console.log(this.testAll)
          }else{
            this.testAll = {};   
            this.testWithoutClass = {};  
            this.noTest = true;   
          }
      }); 
    }  
  }


  
  async presentAlert(id) {
 
    var token = await this.storageService.get(AuthConstants.AUTH);  
    var toast = this.toastService;
    var serv_home = this.homeService; 
    var mainthis = this;
    function delete_l(id){
      serv_home.deltest(id,token).subscribe(
        (res: any) => {   
          mainthis.getTests(mainthis.iacs,token);
           
        }); 
      }
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Confirm!',
        message: 'Are you sure you want to delete this !!!',
        buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Yes',
          handler: function() {
           
            delete_l(id); 
          }
        }
      ]
    }); 
    await alert.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { PreviousRouteService } from '../previous-route.service';  
import { AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';  
@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.page.html',
  styleUrls: ['./lectures.page.scss'],
})
export class LecturesPage implements OnInit {
  iacs:number;
  nolectures:boolean;
  lectures:[];
  previousUrl:any;
  subject:any;
  showUnitFor:any;
  public href: string = ""; 
  constructor( 
    private previousRouteService: PreviousRouteService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private toastService: ToastService
  ) { }


    async ngOnInit() { 
      this.nolectures = false;
      var token =  await this.storageService.get(AuthConstants.AUTH);
      this.route.queryParams.subscribe(
        params => {
          this.iacs =  params['iacs']; 
          this.subject =  params['subject'];  
          this.getallectures(this.iacs,token);
          if(this.iacs && this.subject){   
            this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject;  
          }
          if(this.iacs && !this.subject){   
            this.previousUrl = 'subject-detail?iacs='+this.iacs;  
          }
        }
      )
    }
    async getallectures(iacs,token){
      if(iacs && token){    
        await this.homeService.openLecture(iacs,token).subscribe(
          (res: any) => {    
            if(res.data.length > 0){
              this.lectures = res.data ? res.data:'';  
              this.nolectures = false;  
            }else{
              this.lectures = [];   
              this.nolectures = true;   
            }
          }); 
      }  
    }

    toggleShow(unit) {
      if(unit){
        this.showUnitFor = unit;
      }else{
        this.showUnitFor = '';
      } 
    }

  async presentAlert(id) { 
    var token = await this.storageService.get(AuthConstants.AUTH);  
    var toast = this.toastService;
    var serv_home = this.homeService; 
    var mainthis = this;
    function delete_l(id){
      serv_home.delLecture(id,token).subscribe(
        (res: any) => {   
          mainthis.getallectures(mainthis.iacs,token);
          toast.presentToast(res.msg);
        }); 
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to delete this lecture!!!',
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

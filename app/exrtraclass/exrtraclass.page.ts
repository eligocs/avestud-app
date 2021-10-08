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
  selector: 'app-exrtraclass',
  templateUrl: './exrtraclass.page.html',
  styleUrls: ['./exrtraclass.page.scss'],
})
export class ExrtraclassPage implements OnInit {
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

    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject']; 
        this.getallectures(this.iacs,token);
        if(this.iacs && this.subject){
          this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject; 
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
  
  async getallectures(iacs,token){
    if(iacs && token){    
      await this.homeService.openExtraclass(iacs,token).subscribe(
        (res: any) => {   
          if(res.data.length > 0){
            this.lectures = res.data ? res.data:'';   
          }else{
            this.lectures = [];   
            this.nolectures = true;   
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
      serv_home.delExtraClass(id,token).subscribe(
        (res: any) => {   
          mainthis.getallectures(mainthis.iacs,token);
          toast.presentToast(res.msg);
        }); 
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to delete this extra class!!!',
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

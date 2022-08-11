import { Component, OnInit } from '@angular/core';
import { AuthConstants } from '../../../config/auth-constants'; 
import { ToastService } from '../services/toast.service';  
import { AlertController  } from '@ionic/angular';  
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { ActivatedRoute  } from '@angular/router';
import { WebrtcService } from '../providers/webrtc.service';
@Component({
  selector: 'app-liveclasses',
  templateUrl: './liveclasses.page.html',
  styleUrls: ['./liveclasses.page.scss'],
})
export class LiveclassesPage implements OnInit {
  previousUrl:any;
  iacs:any;
  subject:any;
  lectures:any;
  nolectures:any;
  constructor(
    public webRTC: WebrtcService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute, 
    private toastService: ToastService,
    public alertController: AlertController,
  ) { }

  async ngOnInit() {
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];  
        this.getLiveClasses(this.iacs,token);
        this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject;  
      }
    )  
  }
  
  getLiveClasses(iacs,token){
    if(iacs && token){   
      var data = {
        iacs:iacs
      } 
      this.homeService.getLiveClasses(data,token).subscribe(
        (res: any) => {    
          if(res.data.length > 0){
            var classes = res.data ? res.data:'';  
            if(classes){ 
              classes.forEach((c) => {  
                c.meeting.forEach((single) => {
                  var date = single.lecture_date +' '+ single.lecture_time;
                  var lec_date = new Date(date);
                  var current_date =  new Date(Date.now() + (10 * 60000));   
                  console.log(current_date.getTime() > lec_date.getTime())
                  if(current_date.getTime() > lec_date.getTime())
                  { 
                    single.lectureIsOn = true;
                  }else{ 
                    single.lectureIsOn = false;
                  }   
                });      
              });       
            }
            if(classes){
              this.lectures = classes;  
              this.nolectures = false;   
            }
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
      serv_home.delLecture(id,token).subscribe(
        (res: any) => {   
          mainthis.getLiveClasses(mainthis.iacs,token);
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

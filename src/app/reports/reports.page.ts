import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { PreviousRouteService } from '../previous-route.service';  
import { ToastService } from '../services/toast.service';  
import { AlertController,ModalController  } from '@ionic/angular';  
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  iacs:any;
  previousUrl:any;
  subject:any;
  assignment:any;
  reportdata:any;
  type:any;
  topic:any;
  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
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
        this.assignment =  params['assignment_id'];  
        this.type =  params['type'];  
        if(this.assignment){
          this.getReport(this.assignment);
        }
        if(this.type && this.type == 'test'){
          this.previousUrl = 'test?iacs='+this.iacs+'&subject='+this.subject;  
        }
        if(this.type && this.type == 'assignment'){
          this.previousUrl = 'assignments?iacs='+this.iacs+'&subject='+this.subject;  
        }
      }
    )
  }

  async resettest(topic,student){
    var token = await this.storageService.get(AuthConstants.AUTH);  
    var toast = this.toastService;
    var serv_home = this.homeService; 
    var mainthis = this;
    function reset(topic,student){
      var postData = {
        topic_id:topic,
        student:student,
      }
      console.log(postData);  
      serv_home.resettest(postData,token).subscribe(
        (res: any) => {    
          toast.presentToast(res.msg);
      }); 
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to reset answers!!!',
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
            reset(topic,student); 
          }
        }
      ]
    });

    await alert.present();
  }

  async getReport(assignment){
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(assignment){
      var newData = {
        topic_id:assignment,
        iacsId:this.iacs,
      }
    await this.homeService.getReport(newData,token).subscribe(
      (res: any) => {    
         this.reportdata = res.allstudents;
         this.topic = res.topic;
      }); 
    }
  }

}

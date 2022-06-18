import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { PreviousRouteService } from '../previous-route.service';  
import { ToastService } from '../services/toast.service';  
import { AlertController,ModalController  } from '@ionic/angular';  
import { StudentService } from '../services/student.service'; 
@Component({
  selector: 'app-updateofflinetime',
  templateUrl: './updateofflinetime.page.html',
  styleUrls: ['./updateofflinetime.page.scss'],
})
export class UpdateofflinetimePage implements OnInit {
  iacs:any;
  timeslots:any;
  subject:any;
  previousUrl:any;
  constructor(
    public modalController: ModalController,
    private previousRouteService: PreviousRouteService,
    private storageService: StorageService,
    private homeService: HomeService,
    private StudentService: StudentService,
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
        this.getTimeslots(this.iacs,token);
        this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject;  
      }
    )
  }

  getTimeslots(id,token){
    this.StudentService.enrollclass(id,token).subscribe(
      (res: any) => {
        if(res.status == 200){ 
          this.timeslots = res.timeslots;   
        }
      }); 
  }

}

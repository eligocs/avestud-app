import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute } from '@angular/router';
import { PreviousRouteService } from '../previous-route.service';
import { StudentService } from '../services/student.service';
import { ToastService } from '../services/toast.service'; 
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit { 
  token:any;
  notifications: any; 
  showloader: any; 
  nomsg: any; 
  previousUrl: any;   
  iacs: any;   
  subject: any;   
  purchased: any;   
  constructor(
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {  } 

  async ngOnInit() { 
    this.nomsg = true;
    this.route.queryParams.subscribe(
      params => {  
        this.iacs =  params['iacs'];
        this.subject = params['subject']; 
        this.purchased = params['purchased']; 
        if(this.iacs && this.subject){
          this.previousUrl = '/subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1';
          this.loaddata(this.iacs); 
        } 
      })
   
    }
    
    async loaddata(iacs){
      if(this.iacs){
        var token =  await this.storageService.get(AuthConstants.AUTH);
        var data = {
          iacs:this.iacs
        }
        await this.studentService.getnotification(data,token).subscribe(
          (res: any) => {   
            if (res) {
              this.notifications = res.messages ?? {}; 
              if(this.notifications.length > 0){
                this.nomsg = false;
              }else{
                this.nomsg = true;
              }
            }
          });
        }
    }

  async delete(id){
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(this.iacs && this.subject){
      var data = {
        iacs:this.iacs,
        id:id,
      }
      await this.homeService.readnotification(data,token).subscribe(
        (res: any) => {    
          this.toastService.presentToast('Notification removed successfully'); 
          this.loaddata(this.iacs);
        });
    }
  }

}

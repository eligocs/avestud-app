import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { HomeService } from '../services/home.service';
import { AlertController,ModalController  } from '@ionic/angular';   
@Component({
  selector: 'app-publish-assignment',
  templateUrl: './publish-assignment.page.html',
  styleUrls: ['./publish-assignment.page.scss'],
})
export class PublishAssignmentPage implements OnInit {
  iacs:string;
  subject:string;
  previousUrl:string;
  assignments:any; 
  publishingDate:string;
  assignment_id:string;
    constructor(
        public modalController: ModalController,
        private homeService: HomeService,
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        ) {} 

  ngOnInit() {

    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];   
        this.assignment_id =  params['assignment_id'];   
        this.previousUrl = 'assignments?iacs='+this.iacs+'&subject='+this.subject;  
      }
    )

  }

  async publishAssigment(){
    var newData = {
      publishingDate : this.publishingDate,  
      iacs : this.iacs,  
    }   
    var token =  await this.storageService.get(AuthConstants.AUTH);    
    await this.homeService.publishAssigment(newData,token).subscribe(
      (res: any) => {    
        console.log(res)
        if (res.status == 200) {
          this.toastService.presentToast('Assignment updated successfully'); 
        } else{
          this.toastService.presentToast('Something went wrong,try again later'); 
        }
      }
      );
    } 

}

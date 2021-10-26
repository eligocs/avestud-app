import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
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
  pagetype:string;
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
        this.pagetype =  params['type'];   
        if(this.pagetype == 'assignment'){
          this.previousUrl = 'assignments?iacs='+this.iacs+'&subject='+this.subject;  
        }else{
          this.previousUrl = 'test?iacs='+this.iacs+'&subject='+this.subject;  
        } 
        this.publishingDate = '';
      }
    )

  }

  setSelectedDate(e){
    this.publishingDate = e;
  }

  async publishAssigment(){
    var newData = {
      publishingDate : this.publishingDate,  
      iacs : this.iacs, 
      id:this.assignment_id 
    }   
    var token =  await this.storageService.get(AuthConstants.AUTH);    
    await this.homeService.publishAssigment(newData,token).subscribe(
      (res: any) => {    
        if (res.status == 200) {
          this.toastService.presentToast(res.msg+' on '+this.publishingDate); 
          let navigationExtras: NavigationExtras = {
            queryParams: { 'iacs': this.iacs ,'subject':this.subject},
            fragment: 'anchor'
          };
          if(this.pagetype == 'assignment'){
            this.router.navigate(['assignments'],navigationExtras);
          }else{
            this.router.navigate(['test'],navigationExtras);
          }
        } else{
          this.toastService.presentToast(res.msg); 
        }
      }
      );
    } 

}

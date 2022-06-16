import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { HomeService } from '../services/home.service';
import { AuthConstants } from '../../../config/auth-constants';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-demovideo',
  templateUrl: './demovideo.page.html',
  styleUrls: ['./demovideo.page.scss'],
})
export class DemovideoPage implements OnInit {
  institute:any;
  avatar:any;
  video:any;
  description:any;
  showloader:any;
  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    private toastService: ToastService
  ) { }

  async ngOnInit() {

    var token =  await this.storageService.get(AuthConstants.AUTH) 
    if(token){
      this.loadData(token);
    }  
  }

  async refreshpage(){
    var token =  await this.storageService.get(AuthConstants.AUTH) 
    if(token){
      this.loadData(token);
    } 
  }
  async loadData(token){
    await this.homeService.profile(token).subscribe(
      (res: any) => {    
        if(res.status == 200){  
          this.institute = res.institute ? res.institute :'';   
          this.description = res.institute.description ? res.institute.description :'';   
         /*  if(this.institute.videoApproval == 0 && this.institute.video){
            this.toastService.presentToast('Content is under approval !!!'); 
          }else if(this.institute.videoApproval == 1 && this.institute.video){
            this.toastService.presentToast('Content approved !!!');  
          } */
        }
      })
  }

  onChangeVideo(event) { 
      this.video = event.target.files[0]; 
  }


  async updateDemoVideo(){
    this.showloader = true;
    var data = {
      video:this.video ? this.video : '',
      description:this.description ? this.description :'', 
    }
    var token =  await this.storageService.get(AuthConstants.AUTH) 
    await this.homeService.updateDemoVideo(data,token).subscribe(
      (res: any) => {    
        if(res.status == 200){    
          this.toastService.presentToast('Content sent for Admin approval'); 
          this.showloader = false;
          window.location.reload();
        }
      })
  }

}

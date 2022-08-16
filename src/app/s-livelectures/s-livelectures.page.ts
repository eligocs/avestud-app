import { Component, OnInit } from '@angular/core';
import { AuthConstants } from '../../../config/auth-constants'; 
import { ToastService } from '../services/toast.service';  
import { AlertController  } from '@ionic/angular';  
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { ActivatedRoute  } from '@angular/router';
import { WebrtcService } from '../providers/webrtc.service';
@Component({
  selector: 'app-s-livelectures',
  templateUrl: './s-livelectures.page.html',
  styleUrls: ['./s-livelectures.page.scss'],
})
export class SLivelecturesPage implements OnInit {
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
        this.previousUrl = 'subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1';  
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


}

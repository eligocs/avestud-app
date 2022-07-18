import { Component, OnInit,ElementRef } from '@angular/core'; 
//import { WebRTCProvider } from '../../providers/webrtc';
import { WebrtcService } from '../providers/webrtc.service';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../../../config/auth-constants'; 
@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})
export class CallPage {
  topVideoFrame = 'partner-video';
  lectureid: string;
  userId: string;
  partnerId: string;
  subject: string;
  iacs: string;
  type: string;
  previousUrl: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
 isteacher:boolean;
 isstudent:boolean;
  constructor(
    public webRTC:WebrtcService,
    public elRef: ElementRef,
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) {}

  async init() {
    var userdetails =  await this.storageService.get(AuthConstants.userdetails);
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    if(userdetails.role == 'institute'){
      this.userId = 'Teacher';
      this.isteacher = true;
      this.isstudent = false;
      this.userId = userdetails.id; 
      //this.webRTC.init(this.userId, this.myEl, this.partnerEl);
    }else{
      this.userId = 'Student';
      this.userId = userdetails.id; 
      this.isteacher = false;
      this.isstudent = true; 
      //this.webRTC.init(this.userId, null, this.partnerEl);
    }    
    this.webRTC.init(this.userId, this.myEl, this.partnerEl);
  }
 

   ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {    
        this.lectureid =  params['lectureid'];
        this.type =  params['type'];
        this.subject =  params['subject'];
        this.iacs =  params['iacs'];
        if(this.type == 'live'){
          this.previousUrl = 'start-live?iacs='+this.iacs+'&subject='+this.subject+'&type='+this.type+'&lectureid='+this.lectureid; 
        }
       /*  if(this.lectureid){
          this.init();
        } */  
        setTimeout(() => {
          this.init(); 
          
        }, 3000);
      }
    )
 
   }
  stop() {
    //this.webRTC.stop();  
  }

  call() { 
    //var students = ['153'];
    this.webRTC.call(this.partnerId); 
    //this.swapVideo('my-video');
  }

  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }
}
/* export class CallPage implements OnInit {
  userId: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  constructor(  
      public webRTC: WebRTCProvider,
      public elRef: ElementRef,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(
      params => {
        this.userId =  params['userName'];   
      }
    )
      if(this.userId){
        this.ionViewDidLoad();
      }
  }

  ionViewDidLoad() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.myEl = this.elRef.nativeElement.querySelector('#partner-video');
    this.webRTC.init(this.userId, this.myEl, this.partnerEl);
  }

  call() {
      this.webRTC.call(this.partnerId);
  }

} */

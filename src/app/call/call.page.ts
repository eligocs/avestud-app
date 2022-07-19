import { Component, OnInit,ElementRef } from '@angular/core'; 
// import { WebRTCProvider } from '../../providers/webrtc';
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
  userId: string;
  lectureid: string;
  type: string;
  subject: string;
  iacs: string;
  previousUrl: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  students: Array<any>= [];
  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) {}

  async init() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');

    var userdetails =  await this.storageService.get(AuthConstants.userdetails);
    this.userId = userdetails.id; 
   /*  if(userdetails.role == 'institute'){
      this.webRTC.init(this.userId, this.myEl, this.partnerEl);
    }else{
      this.webRTC.init(this.userId,null, this.partnerEl);
    } */
    /* this.students.push(this.userId)  */
    /* 
    console.log(list); */
    this.webRTC.init(this.userId, this.myEl, this.partnerEl);
    var list = this.webRTC.listAll();
  }
  
  ngOnInit(): void {
    /* this.route.queryParams.subscribe(
      params => {    
        this.userId =  params['userName'];
        if(this.userId){
          this.init();
          this.students.push(this.userId)
          console.log(this.students)
        }
      }
    ) */
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
  call() { 
    this.webRTC.call(this.students);
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

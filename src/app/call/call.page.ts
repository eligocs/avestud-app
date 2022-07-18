import { Component, OnInit,ElementRef } from '@angular/core'; 
// import { WebRTCProvider } from '../../providers/webrtc';
import { WebrtcService } from '../providers/webrtc.service';
import { Router,ActivatedRoute  } from '@angular/router'; 
@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})
export class CallPage {
  topVideoFrame = 'partner-video';
  userId: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    private route: ActivatedRoute
  ) {}

  init() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    this.webRTC.init(this.userId, this.myEl, this.partnerEl);
  }
  
   ngOnInit(): void {
     this.route.queryParams.subscribe(
      params => {    
        this.userId =  params['userName'];
        if(this.userId){
          this.init();
        }
      }
    )
    
  }
  call() {
    console.log(this.partnerId)
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

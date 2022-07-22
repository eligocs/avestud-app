import { Component, OnInit,ElementRef,AfterViewInit,ViewChild,Renderer2  } from '@angular/core'; 
// import { WebRTCProvider } from '../../providers/webrtc';
import { WebrtcService } from '../providers/webrtc.service';
import { Router,ActivatedRoute  } from '@angular/router'; 
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../../../config/auth-constants'; 
import $ from 'jquery';
@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})
export class CallPage  implements OnInit {
  @ViewChild('studentContainer') 
  public studentContainer : ElementRef;
  public tiffCanvas: HTMLCanvasElement;
  topVideoFrame = 'partner-video';
  userId: string;
  mutestate: boolean;
  lectureid: string;
  type: string;
  userimage: string;
  students: any[] = [];
  usertype: string;
  subject: string;
  studentEl: HTMLMediaElement;
  myvideo: boolean;
  pausevideo: boolean;
  streaming: boolean;
  showreset: boolean;
  iacs: string;
  previousUrl: string;
  partnerId: string;
  userdetails: any;
  mainElement: HTMLMediaElement;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  private video: HTMLMediaElement; 
  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private renderer:Renderer2
  ) {}

  async init() {
   var mThis = this;

    var userdetails =  await this.storageService.get(AuthConstants.userdetails); 
    this.userdetails = userdetails; 
    this.userId = userdetails.id 
    if(userdetails.role == 'institute'){
      this.studentEl = document.querySelector('#my-video-el');
      this.myvideo = true; 
      this.mainElement = document.querySelector('#demoicon');
      this.mainElement.setAttribute('style','padding-top:0px');
      var video = document.createElement('video'); 
      video.setAttribute('autoplay', '');
      video.setAttribute('height', '350');
      video.setAttribute('width', '100%');
      video.setAttribute('playsinline', '');
      video.setAttribute('class', 'my-video');
      video.setAttribute('id', 'my-video'); 
      video.setAttribute('style', 'transition: transform 0.8s;-webkit-transform: scaleX(-1);transform: scaleX(-1);'); 
      $('#demoicon').html(video);
      this.usertype = 'institute';
      this.myEl = document.querySelector('#my-video'); 
      this.webRTC.init(this.userId, this.myEl,this.partnerEl,this.studentEl,'institute',this.students);  
    }else{ 
        this.students.push(this.userId);  
      this.myEl = document.querySelector('#my-video-el'); 
      this.mainElement = document.querySelector('#demoicon');
      this.mainElement.setAttribute('style','padding-top:0px');
      var video = document.createElement('video'); 
      video.setAttribute('autoplay', '');
      video.setAttribute('height', '350');
      video.setAttribute('width', '100%');
      video.setAttribute('playsinline', '');
      video.setAttribute('class', 'partner-video');
      video.setAttribute('id', 'partner-video'); 
      $('#demoicon').html(video);
      this.partnerEl = document.querySelector('#partner-video'); 
      this.webRTC.init(this.userId, this.myEl, this.partnerEl,this.studentEl,'student',this.students);
      this.usertype = 'student'; 
      this.myvideo = false;  
    }   
  } 
  
  refreshStudents(){
    this.webRTC.refreshStudents()
  }
  
  reset(){
    window.location.reload();
  }

  /* openCam(){
      this.myEl = document.querySelector('#my-video-el');
      this.partnerEl = document.querySelector('#partner-video'); 
      this.webRTC.init(this.userId, this.myEl, this.myEl,this.studentEl);
  } */

  ngOnInit(): void { 
    this.streaming = false;
    this.showreset = true;
    this.route.queryParams.subscribe(
      params => {    
        this.lectureid =  params['lectureid'];
        this.type =  params['type'];
        this.subject =  params['subject'];
        this.iacs =  params['iacs'];
        if(this.type == 'live'){
          this.previousUrl = 'liveclasses?iacs='+this.iacs+'&subject='+this.subject; 
        } 
        this.init();  
      }
    )
  }
  stop() {  
    if(this.pausevideo == true){
      this.pausevideo = false;
    }else{
      this.pausevideo = true;
    }
    this.webRTC.stop(); 
  }
  mutevideo() {   
    if(this.mutestate == true){
      this.mutestate = false;
    }else{
      this.mutestate = true;
    }
    this.webRTC.mutevideo(); 
  }

  startRecord(){

  }

  join() {     
    this.webRTC.hand('152',this.userdetails,this.userimage); 
  }
  call() { 
    if(this.pausevideo == true){
      this.pausevideo = false;
      this.webRTC.stop();
    }
    if(!this.showreset){
      this.showreset = true;
      this.streaming = false; 
      this.init(); 
    }else{
      if(this.streaming == true){
        this.streaming = false; 
        this.showreset = false;
        this.webRTC.stop(); 
      }else{   
        this.streaming = true; 
        this.students = ['398','153'];  
        this.webRTC.call(this.students);
      }
    }
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

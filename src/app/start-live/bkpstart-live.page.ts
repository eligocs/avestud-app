import { Component, ViewChild, AfterViewInit,OnInit,ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController } from '@ionic/angular'; 
import { StorageService } from '../services/storage.service';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import { AuthConstants } from '../../../config/auth-constants';
import { ToastService } from '../services/toast.service';
import { WebrtcService } from '../providers/webrtc.service';
var front = false;
@Component({
  selector: 'app-start-live',
  templateUrl: './start-live.page.html',
  styleUrls: ['./start-live.page.scss'],
})
export class StartLivePage implements AfterViewInit {

  @ViewChild('videoContainer') videoContainer;
  private video: HTMLVideoElement;
  userId: string;
  front: boolean;
  mutestate: boolean;
  streaming:any;
  videoStatus:any;
  subject:any;
  iacs:any;
  lectureid:any;
  type:any;
  previousUrl:any;
  buttontext:any;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    private toastService: ToastService,
    private platform: Platform, 
    private androidPermissions: AndroidPermissions,
    public navCtrl: NavController,
    private router: Router,  
    private storageService: StorageService,
    private route: ActivatedRoute,
    ) {
    this.video = document.createElement('video'); 
    this.video.setAttribute('autoplay', ''); 
  }

  async ngAfterViewInit() { 
    this.front = false;
    this.mutestate = true; 
    this.videoStatus = true;
    var userdetails =  await this.storageService.get(AuthConstants.userdetails);
    if(userdetails.role == 'institute'){
      this.buttontext = 'Stream';
    }else{
      this.buttontext = 'Join';
    } 
    setTimeout(() => {
      this.initWebRTC() 
    }, 2000);
    
    
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs']; 
        this.subject =  params['subject']; 
        this.lectureid =  params['lectureid'];  
        this.type =  params['type'];
        if(this.type == 'live'){
          this.previousUrl = 'liveclasses?iacs='+this.iacs+'&subject='+this.subject;  
        }
        if(this.lectureid){
          this.lectureid = this.lectureid; 
        }  
      }); 

  }

  

  login() { 
    this.initWebRTC();
    let navigationExtras: NavigationExtras = {
      queryParams: { 
        'lectureid': this.lectureid,
        'iacs': this.iacs,
        'subject': this.subject,
        'type': this.type,
      },
      fragment: 'anchor'
    };
    this.router.navigate(['call'],navigationExtras);
  }


  mutevideo(){ 
    this.streaming.getAudioTracks()[0].enabled = (!this.streaming.getAudioTracks()[0].enabled);
    if(this.mutestate == true){
      this.mutestate = false; 
      this.toastService.presentToast('Audio muted !!!'); 
    }else{
      this.mutestate = true;  
      this.toastService.presentToast('Audio unmuted !!!'); 
    }
  } 

  startRecord(){
    
  }
  
  startstream(){
    this.videoContainer.nativeElement.appendChild(this.video);   
    this.videoStatus = true; 
  }

  flipcamera(){ 
    if(this.front == false){
      this.front = true;
    }else{
      this.front = false;
    }
    this.initWebRTC();
  }

  goback(){
    var stream = this.streaming;
    this.videoStatus = false;
    stream.getTracks().forEach(function(track) { track.stop(); });
    let navigationExtras: NavigationExtras = {
      queryParams: { 'iacs': this.iacs, 'subject':this.subject },
      fragment: 'anchor'
    };
    this.router.navigate(['liveclasses'],navigationExtras);
  }

  stopStartVideo() {
      var stream = this.streaming; 
      if(this.videoStatus){
        this.videoStatus = false;
        stream.getTracks().forEach(function(track) { track.stop(); });
        this.toastService.presentToast('Video stream stopped !!!'); 
      }else{
        this.toastService.presentToast('Video stream started !!!'); 
        this.videoStatus = true;
        this.initWebRTC();
      } 
  }

  initWebRTC() {
    const constraints = {
      video: true,
      audio: false
    };   
    navigator.getUserMedia({ audio: true, video:
       {
        width: {  ideal: 380 },
        height: {  ideal: 350 },
        facingMode : this.front ? "user" : "environment"
      }
    }, (stream) => { 
      (<any>window).stream = stream; // make stream available to browser console
      this.video.srcObject = stream; 
      this.streaming = stream;
      this.startstream(); 
    }, (error) => {
      alert(error)
      console.error('[getMedia] cannot get user media'); 
    }); 
    
  }

}

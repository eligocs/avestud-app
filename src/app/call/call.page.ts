import { Component, OnInit,ElementRef,AfterViewInit,ViewChild,Renderer2  } from '@angular/core';  
import { WebrtcService } from '../providers/webrtc.service';
import { Router,ActivatedRoute  } from '@angular/router'; 
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../../../config/auth-constants'; 
import $ from 'jquery';
import { ToastService } from '../services/toast.service'; 
import { HomeService } from '../services/home.service'; 
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
  joined: boolean;
  subject: string;
  studentEl: HTMLMediaElement;
  myvideo: boolean;
  pausevideo: boolean;
  streaming: boolean;
  showreset: boolean;
  iacs: string;
  previousUrl: string;
  teacher: string;
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
    private renderer:Renderer2,
    private toastService: ToastService,
    private homeService: HomeService,
  ) {}

  async init() { 
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
      video.setAttribute('class', 'my-video videoStream');
      video.setAttribute('id', 'my-video'); 
      video.setAttribute('style', 'transition: transform 0.8s;-webkit-transform: scaleX(-1);transform: scaleX(-1);'); 
      $('#demoicon').html(video);
      this.usertype = 'institute';
      this.myEl = document.querySelector('#my-video'); 
      this.webRTC.init(this.userId, this.myEl,this.partnerEl,this.studentEl,'institute',this.students);  
      this.previousUrl = 'liveclasses?iacs='+this.iacs+'&subject='+this.subject; 
    }else{  
      this.myEl = document.querySelector('#my-video-el'); 
      this.mainElement = document.querySelector('#demoicon');
      this.mainElement.setAttribute('style','padding-top:0px');
      var video = document.createElement('video'); 
      video.setAttribute('autoplay', '');
      video.setAttribute('height', '350');
      video.setAttribute('width', '100%');
      video.setAttribute('playsinline', '');
      video.setAttribute('class', 'partner-video videoStream');
      video.setAttribute('id', 'partner-video'); 
      $('#demoicon').html(video);
      this.partnerEl = document.querySelector('#partner-video');  
      this.webRTC.init(this.userId, this.myEl, this.partnerEl,this.studentEl,'student',this.students);
      this.usertype = 'student'; 
      this.myvideo = false;  
      this.previousUrl = 's-livelectures?iacs='+this.iacs+'&subject='+this.subject; 
    }   
  } 
  
  closeConnection(){
    if(this.joined == true){
      this.joined = false;
      this.webRTC.closeConnection(this.teacher)
    }
  }
  
  refreshStudents(){
    this.webRTC.refreshStudents()
  }
  
  reset(){
    this.webRTC.destroyPeer();
    window.location.reload();
  }


  async ngOnInit(){ 
    this.streaming = false;
    this.showreset = true;
    var token =  await this.storageService.get(AuthConstants.AUTH)
    this.route.queryParams.subscribe(
      params => {    
        this.lectureid =  params['lectureid'];
        this.type =  params['type'];
        this.subject =  params['subject'];
        this.iacs =  params['iacs']; 
        //this.init();  
        this.getTeacher(this.iacs,token);  
      }
    )
  }

  stopMedia(){
    this.webRTC.stop();
    window.location.href=this.previousUrl;
  }

  async getTeacher(iacs,token){
    var newData = {
      iacs :iacs,  
    }  
    await this.homeService.getTeacher(newData,token).subscribe(
      (res: any) => { 
        if(res.status == 200){
          this.teacher = res.teacher.id; 
        }
      })
  } 
  
  stop() {  
    var teacher = this.teacher;
    if(this.pausevideo == true){
      this.pausevideo = false; 
      this.webRTC.pauseVideo(false,teacher); 
    }else{
      this.webRTC.pauseVideo(true,teacher); 
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
    this.webRTC.mutevideo(this.mutestate); 
  }

  startRecord(){
    this.webRTC.startRecord();
  }

  join() {     
    if(this.joined == true){
      this.joined = false;
    }else{
      this.joined = true;
      this.webRTC.hand(this.teacher,this.userdetails,this.userimage); 
    }
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
        var callok = this.webRTC.call(); 
        if(callok){
          this.streaming = true;   
        }else{
          this.toastService.presentToast("No student joined yet !"); 
        } 
      } 
    }
  }

  raiseHand(){
    this.webRTC.raiseHand();

  }


  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }
}


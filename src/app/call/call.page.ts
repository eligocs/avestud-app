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
  handRaised: boolean;
  streaming: boolean;
  showreset: boolean;
  isRecording: boolean;
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
      this.webRTC.closeConnection(this.teacher,this.userdetails) 
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
    var mainThis = this;
    this.streaming = false;
    this.isRecording = false;
    this.handRaised = false;
    this.showreset = true;
    var token =  await this.storageService.get(AuthConstants.AUTH)
    this.route.queryParams.subscribe(
      params => {    
        this.lectureid =  params['lectureid'];
        this.type =  params['type'];
        this.subject =  params['subject'];
        this.iacs =  params['iacs']; 
        this.getTeacher(this.iacs,token);  
        this.init();  
      }
    )


    $(document).ready(function(){
      $('#my-video-el').click(function(){ 
        $(this).toggleClass('inc_size'); 
      });
      $(document).on('click','.studentRaised',function(){
        var id = $(this).data('id');
        if(id){
          mainThis.allowStudent(id);
        }
      });
      $(document).on('click','.streamFromstudent',function(){
        var id = $(this).data('id');
        if(id){
          mainThis.streamFromstudent(id);
          $('.student_has_question').html('<button style="height: 36px;margin: 4px;background: #cf3b1e;color: white;" class="btn_theme_live streamStopstudent"  data-id="'+id+'"><i class="fa fa-desktop"></i> Stop</button>')
        }
      });
      $(document).on('click','.raiseHand',function(){ 
        mainThis.raiseHand();  
      });
      $(document).on('click','.streamStopstudent',function(){
        var id = $(this).data('id');
        if(id){
          mainThis.streamStopstudent(id);
          $('.student_has_question').html('<button style="height: 36px;margin: 4px;" data-id="'+id+'"  class="btn_theme_live onRaiseHand raiseHand "  ><i class="fa fa-question" aria-hidden="true"></i> Ask</button>'); 
        }
      });
    });
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
        if(res.data){
          this.teacher = res.data.id; 
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
    this.isRecording = true;
    this.webRTC.startRecord();
  }
  stopRecording(){
    this.isRecording = false;
    this.webRTC.stopRecording();
  }

  join() {       
    if(this.joined == true){
      this.joined = false;
    }else{
      this.joined = true;
      this.webRTC.join(this.teacher,this.userdetails,this.userimage); 
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
    if(this.handRaised == false){
      this.handRaised = true;
      this.userdetails.handRaised='1';
      this.webRTC.raiseHand(this.teacher,this.userdetails);  
      $('.onRaiseHand').css({'background':'#ffe700'}).html('<i class="fa fa-info" aria-hidden="true"></i> Wait...');
    }else{
      this.handRaised = false;
      this.userdetails.handRaised='';
      this.webRTC.pauseStudent(this.teacher,this.userdetails); 
      $('.onRaiseHand').css({'background':'#f0f0f0'}).html('<i class="fa fa-question" aria-hidden="true"></i> Ask').removeClass('orange_btn');
    } 
  }
  
  allowStudent(id){
    this.webRTC.allowStudent(id,this.teacher);
    $('.student-'+id).find('.addRaised').find('.studentRaised').html('<i class="fa fa-desktop" aria-hidden="true"></i> Presenting...')
  }
  
  streamFromstudent(id){
    this.userdetails.isPresenting='1';
    this.webRTC.streamFromstudent(this.userdetails,this.teacher);
  }
  
  streamStopstudent(id){
    this.userdetails.isPresenting='';
    this.userdetails.handRaised='';
    this.webRTC.streamStopstudent(this.userdetails,this.teacher);
    this.handRaised = false;
  }


  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }
}


import { Component, OnInit,ElementRef,AfterViewInit,ViewChild,Renderer2  } from '@angular/core';  
import { WebrtcService } from '../providers/webrtc.service'; 
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../../../config/auth-constants'; 
import $ from 'jquery';
import { ToastService } from '../services/toast.service'; 
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
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
  pauseSVideo: boolean;
  lectureid: string;
  unit_id: string;
  showloader:boolean;
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
  pauseSAudio: boolean; 
  isRecording: boolean;
  iacs: string;
  previousUrl: string;
  teacher: string;
  partnerId: string;
  pauseStudentvideo: boolean;
  userdetails: any;
  mainElement: HTMLMediaElement;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  private video: HTMLMediaElement; 
  constructor(
    private router: Router,
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
      video.setAttribute('height', '400');
      video.setAttribute('width', '100%'); 
      video.setAttribute('playsinline', '');
      video.volume = 0;
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
      video.setAttribute('height', '400');
      video.setAttribute('width', '100%');
      video.setAttribute('muted', 'muted');
      video.setAttribute('playsinline', '');
      video.setAttribute('class', 'partner-video videoStream');
      video.setAttribute('id', 'partner-video'); 
      this.myEl.volume = 0;
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
      $('.strmbtn').attr('disabled',false);
      /* $('.onRaiseHand').css({'background': 'linear-gradient(6deg, #2b3642, #667a90)','color': 'white','border-radius': '4px;'}).html('<i class="fa fa-question" aria-hidden="true"></i> Ask question').removeClass('orange_btn'); */
      $('.student_has_question').html('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" data-id="'+this.userId+'"  class="btn_theme_live onRaiseHand raiseHand "   ><i class="fa fa-question" aria-hidden="true"  ></i> Ask Question</button>');  
      $('.leavebtn').attr('disabled',true); 
      $('.pausebtn').attr('disabled',true); 
       
      this.streamStopstudent(this.userId);
      this.webRTC.closeConnection(this.teacher,this.userdetails)  
    } 
    $('.raiseHand').attr('disabled',true);
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
    this.showloader = false;
    this.streaming = false;
    this.pauseSAudio = false;
    this.pauseSVideo = false;
    this.isRecording = false;
    this.handRaised = false;
    this.showreset = true;
    this.pauseSVideo = false;
    var token =  await this.storageService.get(AuthConstants.AUTH)
    this.route.queryParams.subscribe(
      params => {    
        this.lectureid =  params['lectureid'];
        this.unit_id =  params['unit_id'];
        this.type =  params['type'];
        this.subject =  params['subject'];
        this.iacs =  params['iacs'];  
        this.getTeacher(this.iacs,token);  
        this.init();  
      }
    )


    $(document).ready(function(){
      $('.leavebtn').attr('disabled',true); 
      $('.pausebtn').attr('disabled',true); 
      $('.onRaiseHand').attr('disabled',true);
      $('#my-video-el').click(function(){ 
        $(this).toggleClass('inc_size'); 
      });
      $(document).on('click','.studentRaised',function(){
        var id = $(this).data('id');
        var name = $(this).data('name'); 
        if(id && name){
          mainThis.allowStudent(id,name);
        }
      });
      $(document).on('click','.streamFromstudent',function(){
        var id = $(this).data('id');
        if(id){
          mainThis.streamFromstudent(id);
          $('.student_has_question').html('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live  streamStopstudent"  data-id="'+id+'"><i class="fa fa-desktop"></i> Stop</button>')
        }
      });
      $(document).on('click','.raiseHand',function(){ 
        mainThis.raiseHand();  
      });
      $(document).on('click','.streamStopstudent',function(){
        var id = $(this).data('id');
        if(id){ 
          $('.student_has_question').html('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" data-id="'+id+'"  class="btn_theme_live onRaiseHand raiseHand "   ><i class="fa fa-question" aria-hidden="true"></i> Ask Question</button>');  
          $('.strmbtn').attr('disabled',true);
          $('.leavebtn').attr('disabled',false); 
          $('.pausebtn').attr('disabled',false); 
          $('.onRaiseHand').attr('disabled',false);
            mainThis.streamStopstudent(id);  
        }
      });
      $(document).on('click','.strmbtn',function(){
        $('.strmbtn').attr('disabled',true);
        $('.leavebtn').attr('disabled',false); 
        $('.pausebtn').attr('disabled',false); 
        $('.onRaiseHand').attr('disabled',false);
        mainThis.webRTC.join(mainThis.teacher,mainThis.userdetails,mainThis.userimage); 
        mainThis.joined = true;
      });
      $(document).on('click','.pauseSAudio',function(){
        var id = $(this).data('id');
        var name = $(this).data('name'); 
        if((mainThis.pauseSAudio == false)){
          mainThis.pauseSAudio = true;
          $(this).css({'background':'linear-gradient(6deg, #470505, #d41616)'}); 
          mainThis.webRTC.pauseSAudio(id,name,true);  
        }else{
          $(this).removeClass('red_audio_btn'); 
          mainThis.pauseSAudio = false;
          $(this).css({'background':'linear-gradient(6deg, #2b3642, #667a90)'}); 
          mainThis.webRTC.pauseSAudio(id,name,false);  
        } 
      });
      $(document).on('click','.pauseSVideo',function(){
        var id = $(this).data('id');
        var name = $(this).data('name'); 
        if((mainThis.pauseSVideo == false)){
          mainThis.pauseSVideo = true;
          $(this).css({'background':'linear-gradient(6deg, #470505, #d41616)'}); 
          mainThis.webRTC.pauseSVideo(id,name,true);  
        }else{
          $(this).removeClass('red_audio_btn'); 
          mainThis.pauseSVideo = false;
          $(this).css({'background':'linear-gradient(6deg, #2b3642, #667a90)'}); 
          mainThis.webRTC.pauseSVideo(id,name,false);  
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

  flipcam(){
    this.webRTC.flipcam();
  }
  flipStudentcam(){
    this.webRTC.flipStudentcam(this.teacher,this.userdetails,this.userimage);
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
  
  stopStudent() {   
    if(this.pauseStudentvideo == true){
      this.pauseStudentvideo = false;  
    }else{ 
      this.pauseStudentvideo = true;
    }
    this.webRTC.stopStudent(); 
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
  async stopRecording(){
    var mainThis = this;
    this.showloader = true;
    this.isRecording = false;
    var token =  await mainThis.storageService.get(AuthConstants.AUTH)
    this.webRTC.stopRecording(this.lectureid,function(file){ 
      if(file && token){
     /*    var formData = new FormData();
        formData.append('lecture_video', file);  */ 
        var newData = { 
          i_assigned_class_subject_id : mainThis.iacs,
          old_id : mainThis.lectureid, 
          unit : mainThis.unit_id, 
          video : file, 
          type:'live'
        }  
        if(newData){
          mainThis.homeService.createLecture(newData,token).subscribe( (res: any) => { 
            if (res.status == 200) {
              mainThis.toastService.presentToast('Lecture details saved successfully'); 
              let navigationExtras: NavigationExtras = {
                queryParams: { 'iacs': mainThis.iacs,'subject':mainThis.subject },
                fragment: 'anchor'
              }; 
              mainThis.router.navigate(['liveclasses'],navigationExtras); 
              mainThis.showloader = false;
            }
          })
        }
      }
    });
     
    
  }

  join() {        
    $('.strmbtn').attr('disabled',true);
    $('.leavebtn').attr('disabled',false); 
    $('.pausebtn').attr('disabled',false); 
    $('.onRaiseHand').attr('disabled',false);
    this.webRTC.join(this.teacher,this.userdetails,this.userimage); 
  }
  call() { 
    if(this.pausevideo == true){
      this.pausevideo = false;
      this.webRTC.stop();
    }
    if(!this.showreset){
    }else{
      if(this.streaming == true){
        this.streaming = false; 
        this.showreset = false;
        var res = this.webRTC.stop(); 
        if(res){
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }else{   
        var callok = this.webRTC.call(); 
        this.streaming = true;   
        $('.live_stream_btn').html('<i class="fa fa-stop"></i> Stop').css({'background':'#a71a1a'}); 
      } 
    }
  }

  raiseHand(){  
    if(this.handRaised == false){
      this.handRaised = true;
      this.userdetails.handRaised='1';
      this.webRTC.raiseHand(this.teacher,this.userdetails);  
      $('.onRaiseHand').css({'background':'linear-gradient(6deg, #9f6100, #fb9033)','color': 'white','border-radius': '4px'}).html('<i class="fa fa-info" aria-hidden="true"></i> Wait...');
    }else{
      this.handRaised = false;
      this.userdetails.handRaised='';
      this.webRTC.pauseStudent(this.teacher,this.userdetails); 
      $('.onRaiseHand').css({'background': 'linear-gradient(6deg, #2b3642, #667a90)','color': 'white','border-radius': '4px;'}).html('<i class="fa fa-question" aria-hidden="true"></i> Ask question').removeClass('orange_btn');
    } 
  }
  
  allowStudent(id,name){
    this.webRTC.allowStudent(id,name,this.teacher);
    $('.student-'+id).find('.addRaised').find('.studentRaised').html('<i class="fa fa-desktop" aria-hidden="true"></i> Presenting...')
    $('.student-'+id).find('.addRaised').append('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live pauseSAudio" data-name="'+name+'"  data-id="' + id + '"> <i class="fa fa-microphone"></i></button> <button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live pauseSVideo" data-name="'+name+'"  data-id="' + id + '"> <i class="fa fa-play"></i></button>');
  }
  
  streamFromstudent(id){
    this.userdetails.isPresenting='1';
    //this.webRTC.streamFromstudent(this.userdetails,this.teacher);
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


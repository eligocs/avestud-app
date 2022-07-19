import { Component, OnInit,ElementRef,AfterViewInit,ViewChild,Renderer2  } from '@angular/core'; 
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
export class CallPage  implements OnInit {
  @ViewChild('studentContainer') 
  public studentContainer : ElementRef;
  public tiffCanvas: HTMLCanvasElement;
  topVideoFrame = 'partner-video';
  userId: string;
  lectureid: string;
  type: string;
  usertype: string;
  subject: string;
  iacs: string;
  previousUrl: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  private video: HTMLMediaElement;
  students: Array<any>= [];
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
    this.userId = userdetails.id; 
    console.log(this.userId)
    if(userdetails.role == 'institute'){
      this.myEl = this.elRef.nativeElement.querySelector('#my-video');
      this.usertype = 'institute';
      
      this.students = ['165','153'];
      this.students.forEach(function(std){
        var video = document.createElement('video'); 
        video.setAttribute('autoplay', '');
        video.setAttribute('height', '100');
        video.setAttribute('width', '100%');
        video.setAttribute('playsinline', '');
        video.setAttribute('class', 'student-video');
        video.setAttribute('id', 'partner-video'+std); 
        mThis.studentContainer.nativeElement.appendChild(video);  
        mThis.partnerEl = mThis.elRef.nativeElement.querySelector('#partner-video'+std);  
       // mThis.webRTC.init(mThis.userId, mThis.myEl, mThis.partnerEl);

      });
      this.webRTC.init(this.userId, this.myEl, this.partnerEl);
      
    }else{
      this.video = document.createElement('video'); 
      this.video.setAttribute('autoplay', '');
      this.video.setAttribute('height', '100');
      this.video.setAttribute('width', '100%');
      this.video.setAttribute('playsinline', '');
      this.video.setAttribute('class', 'student-video');
      this.video.setAttribute('id', 'partner-video'+this.userId); 
      this.studentContainer.nativeElement.appendChild(this.video);  
      
      this.myEl = this.elRef.nativeElement.querySelector('#partner-video'+this.userId);
      this.partnerEl = this.elRef.nativeElement.querySelector('#my-video');
      this.usertype = 'student'; 
      this.webRTC.init(this.userId, this.myEl, this.partnerEl);
    } 
    /* this.students.push(this.userId)  */
    /* 
    console.log(list); */
    //var list = this.webRTC.listAll();
  }
  
  reset(){
    window.location.reload();
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
          this.previousUrl = 'liveclasses?iacs='+this.iacs+'&subject='+this.subject; 
        }
       /*  if(this.lectureid){
          this.init();
        } */  
        
          this.init(); 
           
      }
    )
  }
  stop() {  
    this.webRTC.stop(); 
  }
  hand() {  
    this.webRTC.hand(this.userId); 
  }
  call() { 
     this.students = ['165','153'];
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

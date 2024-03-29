import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController } from '@ionic/angular'; 
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../../../config/auth-constants';
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
  constructor(
     private platform: Platform,
     private androidPermissions: AndroidPermissions,
     public navCtrl: NavController,
     private router: Router, 
     private route: ActivatedRoute,
     private storageService: StorageService,
     ) {
    this.video = document.createElement('video');
    this.video.width = 300;
    this.video.height = 400;
    this.video.setAttribute('autoplay', '');
    
    // if (this.platform.is('cordova')) {
    //   this.platform.ready().then(() => {
    //     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
    //       result =>{ 
    //         //alert(result.hasPermission) 
    //       },
    //       err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    //     ); 
    //     this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
        
    //   });
    // }
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

  async ngAfterViewInit() {
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
  
  startstream(){
    this.videoContainer.nativeElement.appendChild(this.video);  
  }

  async initWebRTC() {
    const constraints = {
      video: true,
      audio: false
    };

    // const handleSuccess = (stream: MediaStream) => {
    //   (<any>window).stream = stream; // make stream available to browser console
    //   this.video.srcObject = stream;
    // };

    // const handleError = (error: any) => { 
    //   const p = document.createElement('p');
    //   p.innerHTML = 'navigator.getUserMedia error: ' + error.name + ', ' + error.message;
    //    this.videoContainer.nativeElement.appendChild(p);
    // };
    // navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
   /*  var userdetails =  await this.storageService.get(AuthConstants.userdetails); 
    if(userdetails.role == 'institute'){  */
      navigator.getUserMedia({ audio: true, video: true }, (stream) => { 
          (<any>window).stream = stream; // make stream available to browser console
          this.video.srcObject = stream; 
          // this.video.src = URL.createObjectURL(stream); 
          this.startstream(); 
      }, (error) => {
        alert(error)
        console.error('[getMedia] cannot get user media'); 
      }); 
   /*  } */
    
  }
}

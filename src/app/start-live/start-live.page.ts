import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController } from '@ionic/angular'; 
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 

@Component({
    selector: 'app-start-live',
    templateUrl: './start-live.page.html',
    styleUrls: ['./start-live.page.scss'],
})
export class StartLivePage implements AfterViewInit {
  @ViewChild('videoContainer') videoContainer;
  private video: HTMLVideoElement;
  userId: string;
  constructor(private platform: Platform, private androidPermissions: AndroidPermissions,public navCtrl: NavController,private router: Router) {
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
    // this.navCtrl.navigateForward('Call/'+this.userId);
    let navigationExtras: NavigationExtras = {
      queryParams: { 'userName': this.userId},
      fragment: 'anchor'
    };
    this.router.navigate(['call'],navigationExtras);

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initWebRTC() 
    }, 2000);
  }
  
  startstream(){
    this.videoContainer.nativeElement.appendChild(this.video);  
  }

  initWebRTC() {
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
    navigator.getUserMedia({ audio: true, video: true }, (stream) => { 
        (<any>window).stream = stream; // make stream available to browser console
        this.video.src = URL.createObjectURL(stream); 
        this.startstream(); 
    }, (error) => {
      alert(error)
      console.error('[getMedia] cannot get user media'); 
    }); 
    
  }
}

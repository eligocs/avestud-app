import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { AlertController } from '@ionic/angular';  /* 
import { CallNumber } from '@ionic-native/call-number/ngx'; */
@Component({
selector: 'app-login',
templateUrl: './login.page.html',
styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
postData = {
email: '',
password: ''
};
showloader:boolean;
token:'';
typepass:any;
showSplash:boolean;
constructor(
  public alertCtrl: AlertController,
private router: Router,
private authService: AuthService,
private storageService: StorageService,
private toastService: ToastService,
/* private callNumber: CallNumber */
) {}

async ngOnInit() { 
  this.typepass = 'password';
  this.showloader = false;
  if(AuthConstants.Role){
    this.storageService.removeStorageItem(AuthConstants.Role); 
  }
  var user =  await this.storageService.get(AuthConstants.AUTH);  
  var role =  await this.storageService.get(AuthConstants.Role);    
  if(role == 'institute'){
   window.location.href = 'homepage';
  }else if(role == 'student'){
    window.location.href = '/studenthome';
  }
  setTimeout(() => {
    this.showSplash = true;
  }, 2500);
}

  showpassword(){
    if(this.typepass == 'password'){
      this.typepass = 'text';
    }else{
      this.typepass = 'password';
    } 
  }

  /* launchDialer(n:string){
    this.callNumber.callNumber(n, true)
    .then(() => {window.location.href = '/signup'})
    .catch(() => window.location.href = '/hompage');
  } */
async showAlert() {   
  const alert = await this.alertCtrl.create({  
    message: '<p>Send verification code to <br> verify your number </p>',
    cssClass: 'alert-box',
    inputs: [
      
      {
        name: 'pin',
        cssClass:'enter_otp',
        type:'number'
      }, 
    ],
    buttons: [
        {
        text: 'resend otp',
        cssClass:'alert_otp_btn' 
        },
        {
          text:'sign up',
          cssClass: 'alert_signup_btn'
        }
      ]

      
  });  

  await alert.present();  
  const result = await alert.onDidDismiss();  
} 

validateInputs() {
let email = this.postData.email.trim();
let password = this.postData.password.trim();
  return (
    this.postData.email &&
    this.postData.password &&
    email.length > 0 &&
    password.length > 0
  );
}

  loginAction() {  
    this.showloader = true;
    if (this.validateInputs()) {
      this.authService.login(this.postData).subscribe(
      (res: any) => { 
        if (res.access_token) { 
          this.storageService.store(AuthConstants.AUTH, res.access_token);   
          this.storageService.store(AuthConstants.userdetails, res.userdetails);  
           if(res.role == 'student'){
             window.location.href = 'studenthome';
           } else if(res.role == 'institute'){
             window.location.href = 'homepage'; 
           }
            
        } else {
          this.toastService.presentToast('Incorrect email and password.');
        }
        this.showloader = false;
      },
      (error: any) => { 
        this.toastService.presentToast('Credentials do not match our records');
        this.showloader = false
      }
      );
    } else { 
        this.toastService.presentToast('Username & Password Required !!!'); 
        this.showloader = false
      }
    }
  }

/* 
  export class imageSlider {

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    autoplay: {
          delay: 2000
    },

    pagination : {
      el: '.swiper-pagination',
      clickable: true,
      type: 'progressbar',
      progressbarFillClass: 'swiper-pagination-progressbar-fill',
      renderProgressbar: function (progressbarFillClass) {
        return '<span class="' + progressbarFillClass + '" style="background: red"></span>';
      }
    }

  }
} */
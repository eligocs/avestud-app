import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from '../services/auth.service'; 
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
  })
  export class SignupPage implements OnInit {
  postData = {
    name: '',
    phone: '',
    grade: '',
    state: '',
    city: '', 
    password: '',
    confirm_password: '',
  };
  
  constructor(
  private authService: AuthService,
  private toastService: ToastService,
  private storageService: StorageService,
  private router: Router,
  public alertCtrl: AlertController
  ) {}
  
  async ngOnInit() { 
    var token =  await this.storageService.get(AuthConstants.AUTH); 
    var mainThis = this; 
    if(token){

    } 
  }
  
  validateInputs() { 
    let name = this.postData.name;
    let password = this.postData.password;
    let confirm_password = this.postData.confirm_password;
    let phone = this.postData.phone;
    let grade = this.postData.grade;
    let state = this.postData.state;
    let city = this.postData.city;
    if(name == ''){
      return 0;
    }
    if(password == ''){
      return 0;
    }
    if(confirm_password == ''){
      return 0;
    }
    if(phone == ''){
      return 0;
    }
    if(grade == ''){
      return 0;
    }
    if(state == ''){
      return 0;
    }
    if(city == ''){
      return 0;
    }
    return 1;
  }
  
  register_student() { 
    if (this.validateInputs()) {
      if(this.postData.password == this.postData.confirm_password){
        this.authService.register_student(this.postData).subscribe(
          (res: any) => {
            if (res.status == 200) {   
                this.storageService.removeStorageItem(AuthConstants.otp);
                this.storageService.removeStorageItem(AuthConstants.phone);
                this.storageService.removeStorageItem(AuthConstants.pwd);
                this.storageService.store(AuthConstants.otp, res.otp);
                this.storageService.store(AuthConstants.phone, res.phone); 
                this.storageService.store(AuthConstants.pwd, res.pwd); 
                this.router.navigate(['verifyotp']); 
            } else {
              this.toastService.presentToast(
                'Details already exist, please enter new one'
              );
            }
          },
        (error: any) => {
          this.toastService.presentToast('Network Issue.');
        });
      }else{
        this.toastService.presentToast(
          'Password did not match !!!'
        );
      }
    } else {
        this.toastService.presentToast(
          'All the fields are required'
        );
    }
  }
  
  signAction() { 
    if (this.validateInputs()) {
      this.authService.signup(this.postData).subscribe(
        (res: any) => {
          if (res.userData) {
          // Storing the User data.
            this.storageService
              .store(AuthConstants.AUTH, res.userData)
              .then(res => {
              this.router.navigate(['home/feed']);
            });
          } else {
            this.toastService.presentToast(
              'Data alreay exists, please enter new details.'
            );
          }
        },
        (error: any) => {
          this.toastService.presentToast('Network Issue.');
        });
    } else {
        this.toastService.presentToast(
          'Please enter email, username or password.'
        );
    }
  }
 

  /* async showAlert() {  
    
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
  }  */
} 
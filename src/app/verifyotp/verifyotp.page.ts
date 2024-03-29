import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { AuthConstants } from '../../../config/auth-constants';
@Component({
  selector: 'app-verifyotp',
  templateUrl: './verifyotp.page.html',
  styleUrls: ['./verifyotp.page.scss'],
})
export class VerifyotpPage implements OnInit {
  postData = {
    otpentered : ''
  }
  otp:any;
  phone:any;
  constructor(  
    private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router) { }

  async ngOnInit() { 
    var otp = await this.storageService.get(AuthConstants.otp);  
    
  }

  async verifyotp(){
    var otp = await this.storageService.get(AuthConstants.otp);   
    var phone = await this.storageService.get(AuthConstants.phone); 
    var pwd = await this.storageService.get(AuthConstants.pwd);   
   
    if(this.postData.otpentered !='' && this.postData.otpentered == otp){
        this.toastService.presentToast('Phone number verified successfully'); 
        if(phone){
          var newData = {
            email : phone,
            password : pwd,
          } 
          await this.authService.login(newData).subscribe(
            (res: any) => { 
              
              if (res.access_token) { 
                this.storageService.removeStorageItem(AuthConstants.otp);
                this.storageService.store(AuthConstants.AUTH, res.access_token);  
                this.storageService.removeStorageItem(AuthConstants.phone);
                this.storageService.removeStorageItem(AuthConstants.pwd); 
                this.toastService.presentToast('You have registered successfully');
                setTimeout(() => {
                  window.location.href = 'studenthome';
                }, 2000);
                //this.router.navigate(['homepage']);
              } else {
                this.toastService.presentToast('Incorrect email and password.');
              }
            })
        }
        //this.router.navigate(['/']); 
    }else if(this.postData.otpentered == ''){
      this.toastService.presentToast('Please enter OTP sent to your phone number !!!');  
    }else{
      this.toastService.presentToast('OTP did not match !!!'); 
    }
   

  }
  async resendOtp(){   
    var phone = await this.storageService.get(AuthConstants.phone);   
   
    if(phone){  
        var newData = {
          phone : phone, 
        } 
        await this.authService.resendOtp(newData).subscribe(
          (res: any) => {  
            if (res.status == 'Success') {  
              this.storageService.removeStorageItem(AuthConstants.otp);
              this.storageService.store(AuthConstants.otp, res.otp); 
              this.toastService.presentToast('Otp sent successfully');
            } else {
              this.toastService.presentToast('Fail to sent otp');
            }
          })  
    } else{
      this.toastService.presentToast('Phone number required !!!'); 
    }
   

  }

}

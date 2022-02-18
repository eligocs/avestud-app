import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import { AuthConstants } from '../../../config/auth-constants'; 
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { AlertController } from '@ionic/angular'; 
import { windowWhen } from 'rxjs/operators';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  postData = {
    phone: '', 
    otp: '', 
    };
    showloader:boolean;
    token:'';
    otpinput:boolean;
  constructor(
    public alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
  }
  validateInputs() {
    this.otpinput = false;
    let phone = this.postData.phone.trim(); 
      return (
        this.postData.phone &&
        phone.length > 0 
      );
    }

    async verifyotp(){
      var verified =  await this.storageService.get(AuthConstants.otp)    
      if(this.postData.otp){
        var otp = this.postData.otp; 
        if(otp == verified){
          let navigationExtras: NavigationExtras = {
            queryParams: { 'phone': this.postData.phone},
            fragment: 'anchor'
          };
          this.router.navigate(['newpassword'],navigationExtras); 
        }
      }
    }
  forgotAction() {  
    this.showloader = true;
    if (this.validateInputs()) {
      this.authService.forgotAction(this.postData).subscribe(
      (res: any) => { 
        if (res.status == 200) {  
          this.storageService.removeStorageItem(AuthConstants.otp);
          this.storageService.removeStorageItem(AuthConstants.phone);
          this.storageService.store(AuthConstants.otp, res.otp);
          this.storageService.store(AuthConstants.phone, res.phone);
          this.showloader = false;
          this.otpinput = true;
        } else {
          this.storageService.removeStorageItem(AuthConstants.otp); 
          this.otpinput = false;
          this.toastService.presentToast(
            'Failed To Send OTP , Try agian Later !!!'
          );
        }
      },
      (error: any) => { 
        this.toastService.presentToast('Something went wrong, try again later !!!');
        this.showloader = false
      }
      );
    } else { 
        this.toastService.presentToast('Phone Number Is Required !!!'); 
        this.showloader = false
      }
    } 

}

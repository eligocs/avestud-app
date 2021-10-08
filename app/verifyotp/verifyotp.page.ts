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
    optentered : ''
  }
  constructor(  
    private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router) { }

  async ngOnInit() { 

  }

  async verifyotp(){
    var otp = await this.storageService.get(AuthConstants.otp);  
    var phone = await this.storageService.get(AuthConstants.phone);  
    if(otp && phone){
      this.authService.register_student(this.postData).subscribe(
        (res: any) => {
          if (res.status == 200) {  
              this.storageService.removeStorageItem(AuthConstants.otp);
              this.storageService.removeStorageItem(AuthConstants.phone);
              this.router.navigate(['login']); 
          } else {
            this.toastService.presentToast(
              'User already exists, go to login.'
            );
          }
        },
      (error: any) => {
        this.toastService.presentToast('Fail to register account.');
      });
    }

  }

}

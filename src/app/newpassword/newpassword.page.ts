import { Component, OnInit } from '@angular/core'; 
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from '../services/auth.service';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { AlertController } from '@ionic/angular'; 
@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.page.html',
  styleUrls: ['./newpassword.page.scss'],
})
export class NewpasswordPage implements OnInit {
  postData = {
    password:'',
    cpassword:'',
    phone:'',
  }
  phone:string;
  showloader:boolean;
  constructor(
    public alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => { 
          this.phone =  params['phone'];    
      }
    ) 
  }
  validateInputs() { 
    let password = this.postData.password.trim(); 
      return (
        this.postData.password &&
        password.length > 0 
      );
  }
  async updatepassword(){
    this.showloader = true;
    if (this.validateInputs()) {
      if(this.postData.password == this.postData.cpassword){
        this.postData.phone = this.phone;
        await this.authService.updatepassword(this.postData).subscribe(
        (res: any) => {  
          if (res.status == 200) {    
            this.showloader = false; 
            this.router.navigate(['/']); 
          } else { 
            this.storageService.removeStorageItem(AuthConstants.otp);  
          }
          this.toastService.presentToast(
            res.message
          );
        },
        (error: any) => { 
          this.showloader = false
          this.toastService.presentToast('Something went wrong, try again later !!!');
        }
        );
      }else{
        this.toastService.presentToast('Password did not match !!!'); 
      }
    } else { 
        this.toastService.presentToast('Phone Number Is Required !!!'); 
        this.showloader = false
      }
    } 
}
 

import { Component, OnInit } from '@angular/core'; 
import { Router,ActivatedRoute  } from '@angular/router';
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { AlertController,ModalController  } from '@ionic/angular';   
@Component({
selector: 'modal',
templateUrl: './modal.page.html',
styleUrls: ['./modal.page.scss']
})
export class ModalPage implements OnInit {
  iacs:string;
  subject:string;
  previousUrl:string;
  assignments:any; 
  publishingDate:string;
    constructor(
        public modalController: ModalController,
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        ) {}
        
        ngOnInit() { 
          this.route.queryParams.subscribe(
            params => { 
              this.iacs =  params['iacs']; 
              this.subject =  params['subject'];     
            }
          )

        }
 
        dismiss() { 
            this.modalController.dismiss({
              'dismissed': true
            });
        }

        async publishAssigment() { 
           var token =  await this.storageService.get(AuthConstants.AUTH)    
            var publishingDate = this.publishingDate;
            var data = {
              publishingDate:publishingDate, 
            }
           /*  var classroom =  await this.homeService.publishAssigment(data,token).subscribe(
              (res: any) => { 
                if (res) {
                  this.units = res.data;   
                } 
              }); */
        }

}
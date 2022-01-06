import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import 'select2';                      
import 'select2/dist/css/select2.css';
import { ToastService } from '../services/toast.service'; 
@Component({
  selector: 'app-add-assignment-unit',
  templateUrl: './add-assignment-unit.page.html',
  styleUrls: ['./add-assignment-unit.page.scss'],
})
export class AddAssignmentUnitPage implements OnInit {
  postData = {
    unitName:''
  }
  iacs:any;
  units:any;
  subject:any; 
  previousUrl:any; 
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];  
        if(this.iacs && this.subject){
          this.previousUrl = 'assignments?iacs='+this.iacs+'&subject='+this.subject;  
          this.getAssignmentunits();
        } 
      }
    )  
  }

  async getAssignmentunits(){
    if(this.iacs){
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      var classid= this.iacs;
      var classroom =  await this.homeService.getAssignmentunits(classid,token).subscribe(
        (res: any) => { 
          if (res) {
            this.units = res.data;   
          } 
        });
    }
  }
  
  async createAssigmentUnit(){
    var newData = {
      unitName : this.postData.unitName, 
      iacsId : this.iacs, 
    }    
    
    if(newData){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
        await this.homeService.createAssigmentUnit(newData,token).subscribe(
          (res: any) => {    
            if (res.status == 200) {
              this.toastService.presentToast(res.msg); 
              let navigationExtras: NavigationExtras = {
                queryParams: { 'iacs': this.iacs },
                fragment: 'anchor'
              };
              this.router.navigate(['assignments'],navigationExtras);
            }else{
              this.toastService.presentToast(res.msg); 
            }
          }
        );
      }
  }

}

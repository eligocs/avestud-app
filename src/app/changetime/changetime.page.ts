import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import { StorageService } from '../services/storage.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { StudentService } from '../services/student.service'; 
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-changetime',
  templateUrl: './changetime.page.html',
  styleUrls: ['./changetime.page.scss'],
})
export class ChangetimePage implements OnInit {
  iacs:string;
  subject:string;
  previousUrl:string; 
  slots:any; 
  newTime:any; 
  student_subjects_info_id:any; 
  constructor( 
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private StudentService: StudentService,
    private toastService: ToastService,
    ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];     
        this.student_subjects_info_id =  params['student_subjects_info_id'];     
        this.previousUrl = 'subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1'; 
        this.getTimings(this.iacs,this.subject);  
      }
    )
  }
  async getTimings(iacs,subject){
    var token =  await this.storageService.get(AuthConstants.AUTH)  
    var data = {
      iacs:iacs,
      subject:subject,
    }
    this.StudentService.getTimings(data,token).subscribe(
      (res: any) => {
        if(res.status == 200){     
          this.slots = res?.slots;
        } 
      }); 
  }
  
  
  async updateTimings(){ 
    var token =  await this.storageService.get(AuthConstants.AUTH)  
    var data = {
      student_subjects_info_id:this.student_subjects_info_id,
      newTime:this.newTime, 
    }
    this.StudentService.editClassTime(data,token).subscribe(
      (res: any) => {
        if(res.status == 200){     
          this.slots = res?.slots;
          this.toastService.presentToast(res.msg);
          let navigationExtras: NavigationExtras = {
            queryParams: { 'iacs': this.iacs ,'subject':this.subject,'purchased':1},
            fragment: 'anchor'
          };
          setTimeout(() => {
            this.router.navigate(['subject-detail-student'],navigationExtras);
          }, 2000);
        }else{
          this.toastService.presentToast(res.msg);
        }
      }); 
  }

}

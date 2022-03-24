import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { StudentService } from '../services/student.service';
import { AlertController,ModalController  } from '@ionic/angular';   
@Component({
  selector: 'app-s-lectures',
  templateUrl: './s-lectures.page.html',
  styleUrls: ['./s-lectures.page.scss'],
})
export class SLecturesPage implements OnInit {
    previousUrl: any;
    iacs: any;
    subject: any;
    purchased: any;
    myclasses: any;
    nodata: any;
  constructor( 
    public modalController: ModalController,
    private studentService: StudentService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() { 
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];
        this.subject = params['subject']; 
        this.purchased = 1;
        if(this.iacs && this.subject){
          this.getstudentsubject(this.iacs,this.subject); 
        } 
        if(this.purchased){
          this.previousUrl = '/subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased='+this.purchased; 
        } 
      }
    )  
  }
 async markattendance(lecture,link){
  var token =  await this.storageService.get(AuthConstants.AUTH);    
  var newData = {
    lecture:lecture,  
  } 
  await this.studentService.mark_an_attendence(newData,token).subscribe(
    (res: any) => { 
      if(res.status = 200){
        window.location.href = link;
      }
    });
 }
  async getstudentsubject(iacs_id,lecture){
    var token =  await this.storageService.get(AuthConstants.AUTH);    
    var newData = {
      iacs_id:iacs_id,
      //lecture:lecture,
      token:token,
    } 
    await this.studentService.getstudentsubject(newData,token).subscribe(
      (res: any) => {    
        if (res.status == 200) {
          this.myclasses = res.lecturesGroupedByUnits;   
          if(this.myclasses.length > 0){ 
            this.nodata = false;
          }else{
            this.nodata = true; ;
          }  
        }
      }
    );
  }

}

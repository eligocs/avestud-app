import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { AuthConstants } from '../../../config/auth-constants';
import { ToastService } from '../services/toast.service'; 
@Component({
  selector: 'app-off-line-students',
  templateUrl: './off-line-students.page.html',
  styleUrls: ['./off-line-students.page.scss'],
})
export class OffLineStudentsPage implements OnInit {
  iacs:any;
  subject:any;
  students:any;
  previousUrl:any;
  lectureid:any;
  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private homeService: HomeService,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];  
        this.lectureid =  params['lectureid'];  
        this.getOfflineStudents(this.iacs,token);
        if(this.iacs && this.subject){   
          this.previousUrl = 'lectures?iacs='+this.iacs+'&subject='+this.subject;  
        } 
      }
    )
  }

  async getOfflineStudents(iacs,token){
    if(iacs && token){    
      var postData = {
        i_a_c_s_id:iacs 
      }
      await this.homeService.getOfflineStudents(postData,token).subscribe(
        (res: any) => {     
          if(res.data.length > 0){
            this.students = res.data;
          }else{
            this.students = [];
          }
        }); 
    } 
  }
  
  async mark_student_attendance(lecture_id,student_id){
    var toast = this.toastService;
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(token && lecture_id && student_id){
      var postData = {
        lecture_id:lecture_id,
        student_id:student_id,
      } 
      this.homeService.mark_student_attendance(postData,token).subscribe(
        (res: any) => {     
          if(res.status == 200){
            toast.presentToast(res.msg); 
          }else{
            toast.presentToast(res.msg); 
          }
        }); 
    }
  }

}

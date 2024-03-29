import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import $ from 'jquery';
import { ToastService } from '../services/toast.service'; 
@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.page.html',
  styleUrls: ['./add-assignment.page.scss'],
})
export class AddAssignmentPage implements OnInit {
  postData = {
    unit: '',
    title: '',
    per_q_mark: '', 
    description: '', 
    old_id: '',  
    show_ans: '',  
    testType: '',  
  };
  pagetype:any;
  olddata:any;
  previousUrl:any;
  iacs:any;
  showloader:boolean;
  units:any;
  subject:any;
  assignment_id:any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  async ngOnInit() {  
    
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];   
        this.assignment_id =  params['assignment_id'];   
        this.pagetype =  params['type'];   
        if(this.iacs && this.subject){
          if(this.pagetype == 'assignment'){
            this.previousUrl = 'assignments?iacs='+this.iacs+'&subject='+this.subject;  
          }else{
            this.previousUrl = 'test?iacs='+this.iacs+'&subject='+this.subject;  
          } 
        }
        this.getAssignmentunits();
        if(this.assignment_id){
          this.getSingleAssignment(this.assignment_id);
        }else{ 
          this.postData.unit = '';
          this.postData.title = '';
          this.postData.per_q_mark = ''; 
          this.postData.description = ''; 
          this.postData.old_id = '';  
          this.postData.show_ans = ''; 
          this.postData.testType = '';  
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

  async getSingleAssignment(id){
    if(id){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
      await this.homeService.getSAssigment(id,token).subscribe(
        (res: any) => {     
          if (res.status == 200) { 
            this.olddata = res.data;
            this.postData =  this.olddata; 
          }else{
            this.toastService.presentToast('Something went wrong,try again later'); 
          }
        }
      );
    } 
  }
  
    async createAssigment(){
      this.showloader = true; 
    if(this.postData.unit == ''){
      this.toastService.presentToast('Please select unit !!!'); 
      this.showloader = false;
      return false;
    }
    if(this.postData.title == ''){
      this.toastService.presentToast('Title is required !!!'); 
      this.showloader = false;
      return false;
    }
    if(this.postData.per_q_mark == ''){
      this.toastService.presentToast('Per question mark is required !!!'); 
      this.showloader = false;
      return false;
    }
    if(this.postData.description == ''){
      this.toastService.presentToast('Description is required !!!'); 
      this.showloader = false;
      return false;
    } 
    if(this.postData.testType == ''){
      this.toastService.presentToast('Select paper mode !!!'); 
      this.showloader = false;
      return false;
    }
      var newData = {
        unit : this.postData.unit,
        title : this.postData.title,
        per_q_mark : this.postData.per_q_mark,
        description : this.postData.description, 
        testType : this.postData.testType, 
        show_ans : this.postData.show_ans ? true : false, 
        iacs:this.iacs,
        last_id:this.olddata ? this.olddata.id:''
      }    
      
      if(newData){
        var token =  await this.storageService.get(AuthConstants.AUTH)    
          await this.homeService.createAssigment(newData,token).subscribe(
            (res: any) => {    
              if (res.status == 200) {
                this.toastService.presentToast(res.msg); 
                let navigationExtras: NavigationExtras = {
                  queryParams: { 'iacs': this.iacs ,'subject':this.subject},
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

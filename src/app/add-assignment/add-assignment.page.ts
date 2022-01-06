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
  };
  pagetype:any;
  olddata:any;
  previousUrl:any;
  iacs:any;
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
        if(this.assignment_id){
          this.getSingleAssignment(this.assignment_id);
        }else{ 
          this.postData.unit = '';
          this.postData.title = '';
          this.postData.per_q_mark = ''; 
          this.postData.description = ''; 
          this.postData.old_id = '';  
          this.postData.show_ans = '';  
        }
        this.getAssignmentunits();
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
              }else{
                this.toastService.presentToast('Something went wrong,try again later'); 
              }
            }
          );
    }

  }
  
    async createAssigment(){
      var newData = {
        unit : this.postData.unit,
        title : this.postData.title,
        per_q_mark : this.postData.per_q_mark,
        description : this.postData.description, 
        show_ans : this.postData.show_ans ? true : false, 
        iacs:this.iacs
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

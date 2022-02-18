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
  selector: 'app-add-test',
  templateUrl: './add-test.page.html',
  styleUrls: ['./add-test.page.scss'],
})
export class AddTestPage implements OnInit {
  postData = {
    unit: '',
    title: '',
    per_q_mark: '', 
    description: '', 
    old_id: '',  
    show_ans: '',  
    testType: '',  
    duration: '',  
  };
  showloader:boolean;
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
        if(this.iacs && this.subject){
          this.previousUrl = 'test?iacs='+this.iacs+'&subject='+this.subject;  
          this.getTestunits(this.iacs);
        }
        if(this.assignment_id){
          this.getSingleTest(this.assignment_id);
        }else{ 
          this.postData.unit = '';
          this.postData.title = '';
          this.postData.per_q_mark = ''; 
          this.postData.description = ''; 
          this.postData.old_id = '';  
          this.postData.duration = '';  
          this.postData.testType = '';  
          this.postData.show_ans = '';  
        }
      }
    )   
  }

async getTestunits(id){
  var classid = id;
  var token =  await this.storageService.get(AuthConstants.AUTH)    
  var classroom = this.homeService.getTestunits(classid,token).subscribe(
    (res: any) => { 
      if (res) {
        console.log(res)
        this.units = res.data;   
      } 
    }); 
}
  async getSingleTest(id){
    if(id){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
      await this.homeService.getSAssigment(id,token).subscribe(
        (res: any) => {     
          if (res.status == 200) { 
            this.olddata = res.data;  
            this.postData.testType = res.data.testType;
            this.postData.unit = res.data.unit;
          }else{
            this.toastService.presentToast('Something went wrong,try again later'); 
          }
          this.showloader = false;
        }
      );
    } 
  }

  async createTest(){
    this.showloader = true;
    var newData = {
      unit : this.postData.unit,
      title : this.postData.title,
      per_q_mark : this.postData.per_q_mark,
      description : this.postData.description, 
      show_ans : this.postData.show_ans ? true : false, 
      iacsId:this.iacs,
      timer:this.postData.duration,
      testType:this.postData.testType,
      last_id:this.olddata ? this.olddata.id:''
    }    
    
    if(newData){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
        await this.homeService.createTest(newData,token).subscribe(
          (res: any) => {    
            if (res.status == 200) {
              this.toastService.presentToast(res.msg); 
              let navigationExtras: NavigationExtras = {
                queryParams: { 'iacs': this.iacs ,'subject':this.subject},
                fragment: 'anchor'
              };
              this.router.navigate(['test'],navigationExtras);
            }else{
              this.toastService.presentToast(res.msg); 
            }
          }
        );
      }
  }

}

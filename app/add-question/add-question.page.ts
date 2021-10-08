import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import * as $ from 'jquery';
import 'select2';                      
import 'select2/dist/css/select2.css';
import { ToastService } from '../services/toast.service'; 
@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.page.html',
  styleUrls: ['./add-question.page.scss'],
})
export class AddQuestionPage implements OnInit {
  previousUrl:any;
  postData = {
    topic_id: '',
    question: '',
    a: '', 
    b: '', 
    c: '',  
    d: '',  
    answer: '',  
    answer_exp: '',  
    question_img: '',  
  };
  old_id:any;
  olddata:any;
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

  ngOnInit() {

    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];   
        this.assignment_id =  params['assignment_id'];   
        this.previousUrl = 'list-question?iacs='+this.iacs+'&subject='+this.subject;  
        if(this.assignment_id){
          this.getSingleQuestion(this.assignment_id);
        }else{ 
          this.postData.topic_id = '';
          this.postData.question = '';
          this.postData.a = ''; 
          this.postData.b = ''; 
          this.postData.c = '';  
          this.postData.d = '';  
          this.postData.answer = '';  
          this.postData.question_img = '';  
        }
      }
    ) 


  }

  onChange(event) {
    this.postData.question_img = event.target.files[0]; 
  }

  async getSingleQuestion(id){
    if(id){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
          await this.homeService.getSAssigment(id,token).subscribe(
            (res: any) => {    
              if (res.status == 200) { 
                this.olddata = res.data; 
              }else{
                this.toastService.presentToast(res.msg); 
              }
            }
          );
    }

  }

  async createAssigment(){
    var newData = {
        topic_id : this.assignment_id,
        question : this.postData.question,
        a : this.postData.a,
        b : this.postData.b, 
        c : this.postData.c, 
        d : this.postData.d, 
        answer : this.postData.answer, 
        question_img : this.postData.question_img, 
        iacs:this.iacs,
        testType:1,
        old_id:this.old_id,
        answer_exp:this.postData.answer_exp,
    }         
    if(newData){
      var token =  await this.storageService.get(AuthConstants.AUTH)    
        await this.homeService.createAssigmentQuestion(newData,token).subscribe(
          (res: any) => {    
            if (res.status == 200) {
              this.toastService.presentToast(res.msg); 
              let navigationExtras: NavigationExtras = {
                queryParams: { 'iacs': this.iacs ,'subject':this.subject,'assignment_id':this.assignment_id},
                fragment: 'anchor'
              };
              this.router.navigate(['list-question'],navigationExtras);
            }else{
              this.toastService.presentToast(res.msg); 
            }
          }
        );
    }
  }

}

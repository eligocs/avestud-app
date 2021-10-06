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
  selector: 'app-list-question',
  templateUrl: './list-question.page.html',
  styleUrls: ['./list-question.page.scss'],
})
export class ListQuestionPage implements OnInit {
  iacs:any;
  units:any;
  subject:any;
  assignment_id:any;
  previousUrl:any;
  questionsList:any;
  showEmptyMsg:boolean;
  EmptyMsg:string;
  topic:any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute, 

  ) { }

  ngOnInit() { 
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];   
        this.assignment_id =  params['assignment_id'];   
        this.previousUrl = 'assignments?iacs='+this.iacs+'&subject='+this.subject;  
        if(this.assignment_id && this.iacs){
          this.getQuestions(this.iacs,this.assignment_id);
        } 
      }
    ) 
  }

  async getQuestions(id,assignment){ 
      var token =  await this.storageService.get(AuthConstants.AUTH)  
      var data = {
        iacs : this.iacs, 
        assignment_id : this.assignment_id, 
      }
      await this.homeService.getQuestions(data,token).subscribe(
        (res: any) => {     
          if(res.status == 200){ 
            this.questionsList = res.questions.length > 0 ? res.questions :'';     
            this.topic = res.topic ? res.topic :'';
            this.showEmptyMsg = false;    
            this.EmptyMsg = '';    
          }else{
            this.questionsList = '';
            this.topic = '';
            this.showEmptyMsg = true;    
            this.EmptyMsg = 'No question added yet !!!';    
          }  
          console.log(this.questionsList)
        });
    } 

}

import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StudentService } from '../services/student.service';
import { StorageService } from '../services/storage.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { ToastService } from '../services/toast.service'; 
@Component({
  selector: 'app-startassignment',
  templateUrl: './startassignment.page.html',
  styleUrls: ['./startassignment.page.scss'],
})
export class StartassignmentPage implements OnInit {
  instep:any;
  assignment:any;
  iacs:any; 
  questions:any;
  subject:any;
  previousUrl:any;
  type:any;
  answer:any;
  question_id:any;
  showsubmit:any;
  alreadygiven:boolean;
  showresult:any;
  report:any;
  isquestion:any;
  percentStatus:any;
  correct:any;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.alreadygiven = false; 
    this.showsubmit = false; 
    this.showsubmit=false;
    this.isquestion = 0;
    this.percentStatus = '';
    this.instep = 0;
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];
        this.assignment = params['assignment'];   
        this.subject = params['subject'];   
        this.type = params['type'];   
        if(this.assignment){  
          this.startassignment(this.assignment,token);   
          this.previousUrl = '/s-assignments?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1'; 
          //this.loadstudentAssign(this.iacs,this.subject,token);  
        }
      }
    ) 

    var token =  await this.storageService.get(AuthConstants.AUTH)    
    var userdetails =  await this.storageService.get(AuthConstants.userdetails)  
      
    if(!token ||!userdetails){ 
      window.location.href = '/';
    } 
  }
  changestep(i){ 
      this.instep = i; 
  }
 
  prev(){ 
    if(this.instep > 0){
      this.instep = this.instep - 1; 
    } 
  }
  next(){   
    if(this.answer){ 
      if(this.questions.length -1 > this.instep){
        this.saveAnswer();
        this.instep = this.instep+1; 
      }else if(this.questions.length -1 == this.instep){
        this.saveAnswer();
        this.instep = this.instep+1; 
        this.showsubmit = true; 
        this.alreadygiven = true;
      }  
    }else{
      this.toastService.presentToast('Select Your Answer');
    }
  }
 
  async saveAnswer(){
    var q_id = this.question_id;
    var answer = this.answer; 
    var token =  await this.storageService.get(AuthConstants.AUTH)     
      var newdata = {
        question_id:q_id,
        user_answer:this.answer,
        answer:this.correct,
        topic_id:this.assignment,
      } 
      await this.studentService.saveAnswer(newdata,token).subscribe(
        (res: any) => {       
          if (res.status == 200) { 
            this.toastService.presentToast(res.message);
            this.question_id = '';
            this.answer = ''; 
          }
        }
      ); 
  }

  setAnswer(q_id,answer,correct){ 
    if(q_id && answer){
      this.question_id = q_id;
      this.answer = answer;
      this.correct = correct;
    } 
  }

  toggleShow(i){
    this.isquestion = i;
  }

  async finish(){
    if(this.assignment){
      var newData ={
        topic_id : this.assignment,  
      }
      var token =  await this.storageService.get(AuthConstants.AUTH)     
      await this.studentService.finishAssign(newData,token).subscribe(
        (res: any) => {       
          if (res.status == 200) { 
            this.report = res; 
            this.showresult = true;
            var totalpercent = res.percentage;
            if(totalpercent < 30){
              this.percentStatus = 'Failed !';
            }else if(totalpercent > 30 && totalpercent < 70){
              this.percentStatus = 'Pass !'; 
            }else if(totalpercent > 70 && totalpercent < 80){
              this.percentStatus = 'Good !'; 
            }else if(totalpercent > 70 && totalpercent < 80){
              this.percentStatus = 'Excellent !'; 
            }else if(totalpercent > 80){
              this.percentStatus = 'Excellent !'; 
            }
          }
        }
      ); 
    }
  }

  async startassignment(assignment,token){ 
    var newData = { 
      assignment:assignment, 
    } 
    await this.studentService.startassignment(newData,token).subscribe(
      (res: any) => {       
        if (res.status == 200) { 
          this.questions = res.questions ?? '';
          if(this.questions.length > 0){
            this.alreadygiven = false;  
            this.showsubmit = false; 
            this.showresult = false;
            this.instep = 0; 
          }else if(this.questions.length == 0){
            this.alreadygiven = true; 
            this.showsubmit = true; 
          } 
        }
      }
    ); 
  }

}

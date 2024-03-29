import { Component, OnInit } from '@angular/core'; 
import { StudentService } from '../services/student.service';
import { StorageService } from '../services/storage.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { ToastService } from '../services/toast.service';  
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
@Component({
  selector: 'app-starttest',
  templateUrl: './starttest.page.html',
  styleUrls: ['./starttest.page.scss'],
})
export class StarttestPage implements OnInit {
  instep:any;
  test:any;
  iacs:any; 
  questions:any;
  subject:any;
  previousUrl:any;
  type:any;
  answer:any;
  question_id:any;
  showsubmit:any;
  alreadygiven:any;
  showresult:any;
  report:any;
  isquestion:any;
  percentStatus:any;
  correct:any;
  topic:any;
  countDown:any; 
  time: number;
  skipquestion: any;
  radiovalue: any;
  Spercent: any;
  interval;
  display;
  showLoader: boolean;
  p_bar_value: number;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private toastService: ToastService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.skipquestion = true; 
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
        this.test = params['test'];   
        this.subject = params['subject'];   
        this.type = params['type'];   
        if(this.test){  
          this.starttest(this.test,token);
          this.showresult = false;    
          this.previousUrl = '/s-test?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1'+'&type='+this.type;  
        }
      }
    ) 
    


    var token =  await this.storageService.get(AuthConstants.AUTH)    
    var userdetails =  await this.storageService.get(AuthConstants.userdetails)  
      
    if(!token ||!userdetails){ 
      window.location.href = '/';
    } 
 
  }

  
  showProgressBar() {
    this.showLoader = true;
  }

  hideProgressBar() {
    this.showLoader = false;
  }

  runDeterminateProgress() {
    this.showProgressBar()
    for (let index = 0; index <= 100; index++) {
      this.setPercentBar(+index);
    }
  }

  setPercentBar(i) {
    setTimeout(() => {
      let apc = (i / 100) 
      this.p_bar_value = apc;
    }, 30 * i);
  }

  onChangeHandler($event) {
    this.radiovalue = $event.target.value;
  }

  async StartTimer(){   
    var total_t = this.topic.timer; 
    var mainthis = this; 
    if(total_t){
      this.time = 60*total_t;
      this.interval = setInterval(() => {
        if(this.time > 0) {
            this.time--; 
        } else { 
          if( this.showresult == false){
            this.toastService.presentToast('You fail to finish test on time...');
            let navigationExtras: NavigationExtras = {
              queryParams: { 'iacs': this.iacs ,'subject':this.subject,'purchased':1,'type':this.type},
              fragment: 'anchor'
            };
            this.router.navigate(['s-test'],navigationExtras);
          }
          this.time= 0;
        } 
        this.display=this.transform( this.time) 
      },1000)
    } 
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60)+' min';
  }
  pauseTimer() {
  clearInterval(this.interval);
  }
  changestep(i){ 
    if(this.instep < this.questions.length){
      this.instep = i + 1 ; 
    }
    if(this.instep == this.questions.length){
      this.skipquestion = false;
    }  
  }

  prev(){ 
    if(this.instep > 0){
      this.instep = this.instep - 1; 
      this.skipquestion = true;
    } 
  }

  newstep(i){  
      this.instep = i;  
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
        topic_id:this.test,
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
    if(this.test){
      var newData ={
        topic_id : this.test,  
      }
      var token =  await this.storageService.get(AuthConstants.AUTH)     
      await this.studentService.finishAssign(newData,token).subscribe(
        (res: any) => {       
          if (res.status == 200) { 
            this.report = res; 
            this.showresult = true;
            var totalpercent = res.percentage;
            this.Spercent = Math.round(res.percentage);
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

  async starttest(test,token){ 
    clearInterval(this.interval);
    var newData = { 
      assignment:test, 
    } 
    await this.studentService.starttest(newData,token).subscribe(
      (res: any) => {       
        if (res.status == 200) { 
          this.topic = res.topic ?? '';
          this.questions = res.questions ?? ''; 
          if(this.questions.length > 0){
            this.alreadygiven = false;  
            this.showsubmit = false; 
            this.showresult = false;
            this.instep = 0;  
            this.StartTimer(); 
          }
          if(this.questions.length == 0){
            this.alreadygiven = true; 
            this.showsubmit = true; 
          }
        }
      }
    ); 
  }

}

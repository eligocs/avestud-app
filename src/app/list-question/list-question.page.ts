import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import { AlertController,ModalController  } from '@ionic/angular';  
import { ToastService } from '../services/toast.service';  
import $ from 'jquery';
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
  showUnitFor:any;
  topic:any;
  questionType:any;
  pagetype:any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute, 
    public alertCtrl: AlertController,
    private toastService: ToastService
  ) { }

  ngOnInit() { 


    $(document).ready(function(){
 
      $(".tab").click(function () {
        $(".tab").removeClass("active");
        $(this).addClass("active");   
      });    

      $(document).on('click', '.question_one',function () {
        $(".tab").removeClass("active");
        $('.tab_questions').show();
        $('.tab_answeres').hide();
        $('.tab_explaination').hide();
        $(".question").addClass("active");   
      });

      $(".question").click(function(){
        $('.tab_questions').show();
        $('.tab_answeres').hide();
        $('.tab_explaination').hide();
      });
      
      $(".answer").click(function(){
        $('.tab_answeres').show();
        $('.tab_questions').hide();
        $('.tab_explaination').hide();
      });
      
      $(".explaination").click(function(){
        $('.tab_explaination').show();
        $('.tab_answeres').hide();
        $('.tab_questions').hide();
      });

      // Custom_popover / Dropdown Menu 
        $(function() { // Dropdown toggle
          $(document).on('click', '.list_ques_toogle', function() { 
            $(this).next('.list_ques_dropdown').slideToggle();
          });
          });
      // Custom_popover / Dropdown Menu  end

      
    });
    
    this.showUnitFor = 0;
    this.showEmptyMsg = true;   
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];   
        this.assignment_id =  params['assignment_id'];    
        this.pagetype =  params['type'];      
        if(this.pagetype == 'assignment'){
          this.previousUrl = 'assignments?iacs='+this.iacs+'&subject='+this.subject;  
        }else{
          this.previousUrl = 'test?iacs='+this.iacs+'&subject='+this.subject;  
        }  
        if(this.assignment_id && this.iacs){
          this.getQuestions(this.iacs,this.assignment_id);
        } 
      }
    ) 
  }

  toggleShow(unit) {
    if(unit){
      this.showUnitFor = unit;
    }else{
      this.showUnitFor = 0;
    } 
  }
  async getQuestions(id,assignment){ 
      var token =  await this.storageService.get(AuthConstants.AUTH)  
      var data = {
        iacs : this.iacs, 
        assignment_id : this.assignment_id, 
      }
      await this.homeService.getQuestions(data,token).subscribe(
        (res: any) => {    
          this.questionsList = res.questions ? res.questions :'';     
          this.topic = res.topic ? res.topic :'';
          console.log(this.questionsList);
          if(this.questionsList.length > 0){ 
             this.showEmptyMsg = false;       
          }else{
            this.questionsList = [];
            this.topic = [];
            this.showEmptyMsg = true;       
          }   
        });
        console.log(this.showEmptyMsg)
    } 


    async presentAlert(id) {
 
      var token = await this.storageService.get(AuthConstants.AUTH);  
      var toast = this.toastService;
      var serv_home = this.homeService; 
      var mainthis = this;
      function delete_l(id){
        serv_home.delQuestion(id,token).subscribe(
          (res: any) => {   
            mainthis.getQuestions(mainthis.iacs,mainthis.assignment_id);
             
          }); 
        }
        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Confirm!',
          message: 'Are you sure you want to delete this question!!!',
          buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              
            }
          }, {
            text: 'Yes',
            handler: function() {
             
              delete_l(id); 
            }
          }
        ]
      }); 
      await alert.present();
    }

}

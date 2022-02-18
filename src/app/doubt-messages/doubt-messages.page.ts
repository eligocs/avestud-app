import { Component, OnInit,ViewChild  } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants'; 
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';  
import $  from 'jquery';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-doubt-messages',
  templateUrl: './doubt-messages.page.html',
  styleUrls: ['./doubt-messages.page.scss'],
})
export class DoubtMessagesPage implements OnInit {   
  subject:any;
  iacs:any;
  showEmpty:any;
  previousUrl:any;
  messages:any;
  doubt:any;
  doubtfile:any;
  student:any;
  text_message:any;
  showloader:boolean;
  constructor( private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }
      

  async ngOnInit() {   
    
    var token =  await this.storageService.get(AuthConstants.AUTH);  
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];  
        this.doubt =  params['doubt'];  
        if(this.iacs && this.subject){
          this.previousUrl = 'doubts?iacs='+this.iacs+'&subject='+this.subject;  
          this.loadsingleDoubt(this.iacs,this.doubt,token); 
        }
      });
  }

    /* ngAfterViewInit () { 
      setTimeout(() => {
        this.scrollToElement()  
      }, 1500);
    }  */

    scrollToElement() {
      document.getElementById("text_input").scrollIntoView();
    }

    async send_btn(){ 
      this.showloader = true;
      var mainthis= this;
      var type = 'file';
      var _msg = this.doubtfile;
      if(this.text_message){
        var _msg = this.text_message;
        var type = 'text';
      }  
      var newData = {
        message : _msg, 
        doubt : this.doubt, 
        iacs : this.iacs, 
        student_id : this.student,
        type : type
      }   
      if(newData){
        var token =  await this.storageService.get(AuthConstants.AUTH)   
        var classid= this.iacs;
          await this.homeService.send_btn(newData,token).subscribe(
            (res: any) => {    
              if (res.status == 200) { 
                console.log(res.msg)
                this.toastService.presentToast(res.msg); 
                mainthis.loadsingleDoubt(newData.iacs,newData.doubt,token);
                this.text_message = '';
              }else{
                this.toastService.presentToast(res.msg); 
              }
              this.showloader = false;
            }
          );
        }
    }

    async reloadpage(event) {
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      this.loadsingleDoubt(this.iacs,this.doubt,token);
      this.scrollToElement()  
    }

    onChange(event) {
      this.doubtfile = event.target.files[0]; 
      this.send_btn();
    }

    async loadsingleDoubt(iacs,doubt,token){
      this.showloader = true;
      var token =  await this.storageService.get(AuthConstants.AUTH) 
     
      var data ={
        iacs:iacs,
        doubt:doubt
      }
      await this.homeService.loadsingleDoubt(data,token).subscribe(
        (res: any) => {   
          if (res.status == 200) {
            this.messages = res.messages.reverse();
            this.student = res.doubt.student_id;
            if (res.messages.length > 0) {
              this.showEmpty = false;
            }else{
              this.showEmpty = true;
            } 
            this.showloader = false;
          }
          setTimeout(() => {
            this.scrollToElement()  
          }, 1500);
        }); 
    }
}

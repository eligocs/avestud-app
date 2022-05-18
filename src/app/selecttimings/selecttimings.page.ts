import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { StudentService } from '../services/student.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { Router,NavigationExtras,ActivatedRoute, } from '@angular/router';
import { PreviousRouteService } from '../previous-route.service';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service'; 
import $ from 'jquery';
import { WindowRefService } from '../window-ref.service';
import { environment } from '../../environments/environment';
declare var RazorpayCheckout:any;
@Component({
  selector: 'app-selecttimings',
  templateUrl: './selecttimings.page.html',
  styleUrls: ['./selecttimings.page.scss'],
})
export class SelecttimingsPage implements OnInit {
  id :any; 
  timeings :any;
  coupencode :any;
  previousUrl :any;
  iacsdetails :any;
  timeslots :any;
  classes :any;
  sessiondata:any;
  data:any;
  isfreetrial:any;
  colors:any;
  showcheckout:any;
  instdata:any;
  subjects:any;
  session_key:any;
  form_data : any;
  amount : any;
  class : any;
  student : any;
  cart : any; 
  showpaybutton : any; 
  constructor( 
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private StudentService: StudentService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private winRef: WindowRefService
  ) { }

  async ngOnInit() {
    this.showcheckout = false;
    this.showpaybutton = false;
    var serv_student = this.StudentService; 
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => {
        this.id =  params['id'];  
        this.getTimeslots(this.id,token);
        this.previousUrl = '/searchclass';  
      }
    ) 
  }

  getTimeslots(id,token){
    this.StudentService.enrollclass(id,token).subscribe(
      (res: any) => {
        if(res.status == 200){
          this.iacsdetails = res.iacsdetails; 
          this.timeslots = res.timeslots;  
          
          this.toastService.presentToast('Select your class timings !!!'); 
        }
      }); 
  }

  canclepaynow(){
    this.showcheckout = false;  
  }
  canclefinal(){
    this.showcheckout = true;  
    this.showpaybutton = false;
    this.amount = false;
  }

  async enrollthisclass(){
    var mainThis = this;
    var token =  await this.storageService.get(AuthConstants.AUTH);
    var slotsArr = [];
    var err = 0;
    $(".timevalues").each(function(){
      var day_id = $(this).attr('id');  
      var name = $(this).attr('name'); 
      var time_slot_id = $(this).val();
      if(time_slot_id == ''){
        err = 1;
        mainThis.toastService.presentToast('Please Select time for every day !!'); 
      }
      slotsArr.push({'day_id':day_id,'day':name,'time_slot_id':time_slot_id}); 
    });  
    if(slotsArr && err == 0){
      this.StudentService.enrollthisclass(slotsArr,this.id,token).subscribe(
        (res: any) => { 
          if(res.status == 400){    
            this.toastService.presentToast(res.msg); 
          } 
          if(res.status == 200){   
            this.classes = res.classes;
            this.sessiondata = res.sessiondata;
            this.data = res.data;
            this.isfreetrial = res.isfreetrial;
            this.colors = res.colors;
            this.instdata = res.instdata;
            this.subjects = res.subjects;
            this.session_key = res.session_key;
            this.showcheckout = true;
            this.toastService.presentToast('Have a coupen ?'); 
          }
        }); 
    }
  }
  async paynow(){
    var coupencode = this.coupencode;
    var sessiondata = this.sessiondata;
    var session_key = this.session_key; 
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(sessiondata){
      this.StudentService.paynow(sessiondata,coupencode,session_key,token).subscribe(
        (res: any) => {
          if(res.status == 200){   
            this.form_data = res.form_data;
            this.amount = res.amount;
            this.class = res.class;
            this.student = res.student;
            this.cart = res.cart; 
            this.showpaybutton = true;
            if(res.coupenAppl){
              this.amount = res.coupenAppl.data.amount; 
              this.toastService.presentToast('Coupen Applied Successfully, Proceed To Pay');  
            }else{
              this.amount = res.amount; 
              this.toastService.presentToast('No Coupen Apllied !!! Proceed To Pay');  
            }
          }
        }); 
    }
  }
  async payWithRazor() { 
    var token =  await this.storageService.get(AuthConstants.AUTH);
    var classid = this.id; 
     
    if(classid){
      const options: any = {
        key:  environment.razorpay_key,
        //key: 'rzp_live_ZE7hdsaXoOIu8c',
        amount: this.amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
        currency: 'INR',
        name: '', // company name or product name
        description: '',  // product description 
        modal: { 
          escape: false,
        },
        notes: { 
        },
        theme: {
          color: '#0c238a'
        }
      };
      options.handler = ((response, error) => {
        
        options.response = response; 
        this.StudentService.verifyPayment(response,classid,token).subscribe(
          (res: any) => {
            if(res.status == 200){    
              window.location.href = 'studenthome'; 
            }
            this.toastService.presentToast(res.msg);  
          });  
      });
      options.modal.ondismiss = (() => { 
        console.log('Transaction cancelled.');
      });
      const rzp = new this.winRef.nativeWindow.Razorpay(options); 
      rzp.open();
    }
    
     
  }

}

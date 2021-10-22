import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { BehaviorSubject,Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }

  studenthome(token){
    return this.httpService.get('studenthome',token);
  } 
  getcats(token){
    return this.httpService.get('getcats',token);
  }
  getstudentclass(token,category_id){
    var data = {
      category_id : category_id
    }
    return this.httpService.gettrip('getstudentclass',data,token);
  }
  enrollclass(class_id,token){
    var data = {
      class_id : class_id
    }
    return this.httpService.gettrip('enrollclass',data,token);
  }
  enrollthisclass(slotsarr,class_id,token){ 
    var data = {
      slotsarr : slotsarr,
      class_id : class_id
    }
    return this.httpService.gettrip('enrollthisclass',data,token);
  }
  paynow(sessiondata,coupencode,session_key,token){ 
    var data = {
      coupencode : coupencode, 
      form_data : sessiondata, 
      session_key : session_key, 
    }
    return this.httpService.gettrip('paynow',data,token);
  }
  verifyPayment(response,classid,token){ 
    var data = {
      razorpay_payment_id : response.razorpay_payment_id,  
      class_id : classid,  
    }
    return this.httpService.gettrip('verifyPayment',data,token);
  }

 

}
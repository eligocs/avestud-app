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
  getstudentclass(token,data){
    
    return this.httpService.gettrip('getstudentclass',data,token);
  }
  getstudentclassByname(token,data){ 
    return this.httpService.gettrip('getstudentclass',data,token);
  }
  loadRecipts(token){ 
    return this.httpService.get('loadRecipts',token);
  }
  downloadReceipt(class_id,student_id,token){ 
    var postData = {
      class_id:class_id,
      student_id:student_id, 
    } 
    return this.httpService.gettrip('generate_student_receipt',postData,token);
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
  getstudentextraclass(data,token){  
    return this.httpService.gettrip('getstudentextraclass',data,token);
  }
  loadstudentDoubt(data,token){  
    return this.httpService.gettrip('loadstudentDoubt',data,token);
  }
  getnotification(data,token){  
    return this.httpService.gettrip('getnotification',data,token);
  }
  updateprofile(data,token){  
    return this.httpService.updateprofile('updateprofile',data,token);
  }
  mark_an_attendence(data,token){  
    return this.httpService.gettrip('mark_an_attendence',data,token);
  }
  send_btn(data,token){  
    return this.httpService.send_message('send_btn',data,token);
  }
  getstudentsubject(data,token){  
    return this.httpService.gettrip('getstudentsubject',data,token);
  }
  getTimings(data,token){  
    return this.httpService.gettrip('getTimings',data,token);
  }
  editClassTime(data,token){  
    return this.httpService.gettrip('editClassTime',data,token);
  }
  getstudentAssignment(data,token){  
    return this.httpService.gettrip('getstudentAssignment',data,token);
  }
  startassignment(data,token){  
    return this.httpService.gettrip('startassignment',data,token);
  }
  starttest(data,token){  
    return this.httpService.gettrip('startassignment',data,token);
  }
  saveAnswer(data,token){  
    return this.httpService.gettrip('saveAnswer',data,token);
  }
  finishAssign(data,token){  
    return this.httpService.gettrip('finishAssign',data,token);
  }

 

}
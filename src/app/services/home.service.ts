import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { BehaviorSubject,Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }
 

  getClassRoom(token){ 
    return this.httpService.get('institute',token);
  }
  openAssignments(iacs,token){ 
    var postData = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getAssignments',postData,token);
  }
  createAssigment(data,token){  
    return this.httpService.gettrip('createAssignments',data,token);
  }
  publishAssigment(data,token){  
    return this.httpService.gettrip('publishAssigment',data,token);
  }
  profile(token){  
    return this.httpService.get('profile',token);
  }
  getReport(postData,token){  
    return this.httpService.gettrip('getReport',postData,token);
  }
  resettest(postData,token){  
    return this.httpService.gettrip('resettest',postData,token);
  }
  getLiveClasses(postData,token){  
    return this.httpService.gettrip('getLiveClasses',postData,token);
  }
  getLiveunits(iacs,token){  
    var postData = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getLiveunits',postData,token);
  }
  openSubject(iacs,subject,token){ 
    var postData = {
      iacs:iacs,
      subject:subject, 
    }
    return this.httpService.gettrip('inst_detail',postData,token);
  }
  downloadReceipt(class_id,student_id,token){ 
    var postData = {
      class_id:class_id,
      student_id:student_id, 
    } 
    return this.httpService.gettrip('generate_receipt',postData,token);
  }
  loadstudentdata(iacs,subject,token){ 
    var postData = {
      iacs:iacs,
      subject:subject, 
    }
    return this.httpService.gettrip('loadstudentdata',postData,token);
  }




  updateDemoVideo(data,token){  
    return this.httpService.updateDemoVideo('updateDemoVideo',data,token);
  }



  readnotification(data,token){  
    return this.httpService.gettrip('readnotification',data,token);
  }
  openLecture(iacs,token){ 
    var postData = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('lectures',postData,token);
  }
  openExtraclass(iacs,token){ 
    var postData = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('extraclass',postData,token);
  }
  getClassunits(iacs,token){ 
    var postData = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getClassunits',postData,token);
  }
  getAssignmentunits(iacs,token){ 
    var postData = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getAssignmentunits',postData,token);
  }
  getTestunits(iacs,token){ 
    var postData = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getTestunits',postData,token);
  }
  onChangeAttachment(postData,token){   
    return this.httpService.saveSyllabus('create_notification',postData,token);
  }
  updateTimings(postData,token){   
    return this.httpService.gettrip('updateTimings',postData,token);
  }
  saveSyllabus(postData,token){   
    return this.httpService.saveSyllabus('saveSyllabus',postData,token);
  }
  updateVideo(postData,token){   
    return this.httpService.saveSyllabus('updateVideo',postData,token);
  }
  getstudents(data,token){   
    return this.httpService.gettrip('getstudents',data,token);
  }
  getTests(iacs,token){  
    var data = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getTests',data,token);
  }
  getSTests(iacs,token){  
    var data = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getSTests',data,token);
  }
  createLecture(postData,token){   
    return this.httpService.postWithImg('createLecture',postData,token);
  }
  createExtraClass(postData,token){  
    return this.httpService.postWithImg('createExtraclass',postData,token);
  }
  delLecture(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.delLecture('delLecture',data,token);
  }
  delExtraClass(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.delLecture('delExtraClass',data,token);
  }
  delAssignment(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.delLecture('delAssignments',data,token);
  }
  delQuestion(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.delLecture('delQuestion',data,token);
  }
  deltest(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.delLecture('deltest',data,token);
  }
  getLecture(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.gettrip('getLecture',data,token);
  }
  getExtraClass(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.gettrip('getExtraClass',data,token);
  }
  getSAssigment(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.gettrip('getSAssigment',data,token);
  }
  getSQuestion(id,token){  
    var data = {
      id:id, 
    } 
    return this.httpService.gettrip('getSQuestion',data,token);
  }
  enrollments(iacs,subject_id,token){ 
    var data = {
      iacs:iacs,
      subject:subject_id, 
    } 
    return this.httpService.gettrip('enrollments',data,token);
  }
  searchenrollments(iacs,subject_id,name,token){ 
    var data = {
      iacs:iacs,
      subject:subject_id, 
      name:name, 
    } 
    return this.httpService.gettrip('enrollments',data,token);
  }
  creatnotify(data,token){  
    return this.httpService.gettrip('creatnotify',data,token);
  }

  createAssigmentQuestion(data,token){   
    return this.httpService.createAssigmentQuestion('addAssignmentQuestion',data,token);
  }

  createTest(data,token){   
    return this.httpService.gettrip('createTest',data,token);
  }
  

  getStudentSubjects(data,token){   
    return this.httpService.gettrip('getStudentSubjects',data,token);
  }
  

  getstudentAttendance(data,token){   
    return this.httpService.gettrip('getstudentAttendance',data,token);
  }
  
  getQuestions(id,token){   
    return this.httpService.gettrip('getQuestions',id,token);
  }
  
  
  createAssigmentUnit(data,token){   
      return this.httpService.gettrip('createAssigmentUnit',data,token);
  }
  createLectureUnit(data,token){   
      return this.httpService.gettrip('createLectureUnit',data,token);
  }
  
  createTestUnit(data,token){   
      return this.httpService.gettrip('createTestUnit',data,token);
  }
  
  loadDoubts(iacs,token){  
    var newdata = {
      iacs:iacs, 
    }  
      return this.httpService.gettrip('loadDoubts',newdata,token);
  }
  loadDoubtsByname(name,iacs,token){  
    var newdata = {
      iacs:iacs, 
      name:name, 
    }  
      return this.httpService.gettrip('loadDoubts',newdata,token);
  }
  loadsingleDoubt(newdata,token){   
      return this.httpService.gettrip('loadsingleDoubt',newdata,token);
  }

  send_btn(newdata,token){   
      return this.httpService.senddoubt('senddoubt',newdata,token);
  }

}

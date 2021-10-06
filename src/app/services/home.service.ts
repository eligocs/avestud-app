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
  openSubject(iacs,subject,token){ 
    var postData = {
      iacs:iacs,
      subject:subject, 
    }
    return this.httpService.gettrip('inst_detail',postData,token);
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
  getTests(iacs,token){  
    var data = {
      iacs:iacs, 
    }
    return this.httpService.gettrip('getTests',data,token);
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
  enrollments(iacs,subject_id,token){ 
    var data = {
      iacs:iacs,
      subject:subject_id, 
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
  
  getQuestions(id,token){   
    return this.httpService.gettrip('getQuestions',id,token);
  }
  
  
  createAssigmentUnit(data,token){   
      return this.httpService.gettrip('createAssigmentUnit',data,token);
  }

}

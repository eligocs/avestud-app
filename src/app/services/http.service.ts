import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators'; 
import { Observable, throwError } from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  post(serviceName: string, data: any) {
    var headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json'); 
    const options = { headers: headers, withCredintials: false };
    const url = environment.apiUrl + serviceName; 
    return this.http.post(url, JSON.stringify(data), options);
  }
  get(serviceName: string,token:any) { 
    var headers = new HttpHeaders(
      {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    );  
    const options =  {headers}; 
    const url = environment.apiUrl + serviceName;    
    return this.http.get(url, options); 
  }
  gettrip(serviceName: string,data: any,token:any) {  
    var headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    );  
    const options =  {headers}; 
    const url = environment.apiUrl + serviceName;  
    return this.http.post(url, JSON.stringify(data), options);
  }
  postpdf(serviceName: string,data: any,token:any) {  
    var headers = new HttpHeaders(
      {
        'Content-Type': 'application/pdf',
        'Authorization': 'Bearer ' + token
      }
    );  
    const options =  {headers}; 
    const url = environment.apiUrl + serviceName;  
    return this.http.post(url, JSON.stringify(data), options);
  }
  delLecture(serviceName: string,data: any,token:any) {  
    var headers = new HttpHeaders(
      { 
        'Authorization': 'Bearer ' + token
      }
    );  
    const formDatas = new FormData();
    formDatas.append('id', data.id);
    const options =  {headers}; 
    const url = environment.apiUrl + serviceName;  
    return this.http.post(url, formDatas, options);
  }
  send_message(serviceName: string,data: any,token:any) {         
    const formDatas = new FormData(); 
    formDatas.append('doubt', data.doubt); 
    formDatas.append('student_id', data.student_id); 
    formDatas.append('type', data.type); 
    formDatas.append('iacs', data.iacs);  
    if(data.message){
      formDatas.append('message', data.message); 
    }  
    const url = environment.apiUrl + serviceName;  
    const options = {
      headers: new HttpHeaders({ 
        'Authorization': 'Bearer ' + token,  
      })
    }; 
    return this.http.post(url, formDatas, options);
  }
  postWithImg(serviceName: string,data: any,token:any) {         
    const formDatas = new FormData();
    formDatas.append('unit', data.unit);
    formDatas.append('number', data.number);
    formDatas.append('lecturename', data.lecturename);
    formDatas.append('date', data.date); 
    if(data.old_id){
      formDatas.append('last_id', data.old_id); 
    }
    if(data.notes){
      formDatas.append('notes', data.notes); 
    }
    if(data.video){
      formDatas.append('video', data.video); 
    } 
    formDatas.append('i_assigned_class_subject_id', data.i_assigned_class_subject_id);  
    const url = environment.apiUrl + serviceName;  
    /* const options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
      }) 
    }; */
  
     return this.http.post(url, formDatas,  {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
      })  
    });
    
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  updateprofile(serviceName: string,data: any,token:any) {         
    const formDatas = new FormData();
    formDatas.append('name', data.name);
    formDatas.append('phone', data.phone);
    formDatas.append('board', data.board);
    formDatas.append('date_of_birth', data.date_of_birth);  
    formDatas.append('gender', data.gender);  
    formDatas.append('state', data.state);  
    formDatas.append('city', data.city);  
    formDatas.append('grade', data.grade);  
    if(data.avatar){
      formDatas.append('avatar', data.avatar); 
    }  
    const url = environment.apiUrl + serviceName;  
    const options = {
      headers: new HttpHeaders({ 
        'Authorization': 'Bearer ' + token,  
      })
    };
  
    return this.http.post(url, formDatas, options);
  }
  saveSyllabus(serviceName: string,data: any,token:any) {         
    const formDatas = new FormData(); 
  
    if(data.syllabus){
      formDatas.append('syllabus', data.syllabus); 
    }  
    formDatas.append('i_assigned_class', data.i_assigned_class);  
    formDatas.append('i_assigned_class_subject_id', data.i_assigned_class_subject_id);  
    const url = environment.apiUrl + serviceName;  
    const options = {
      headers: new HttpHeaders({ 
        'Authorization': 'Bearer ' + token,  
      })
    };
  
    return this.http.post(url, formDatas, options);
  }

  updateDemoVideo(serviceName: string,data: any,token:any) {         
    const formDatas = new FormData(); 
   
      formDatas.append('video', data.video); 
      formDatas.append('description', data.description);    
    const url = environment.apiUrl + serviceName;  
    const options = {
      headers: new HttpHeaders({ 
        'Authorization': 'Bearer ' + token,  
      })
    };
  
    return this.http.post(url, formDatas, options);
  }

  senddoubt(serviceName: string,data: any,token:any){
    const formDatas = new FormData(); 
    if(data.message){
      formDatas.append('message', data.message); 
    }
    formDatas.append('doubt', data.doubt); 
    formDatas.append('iacs', data.iacs); 
    formDatas.append('student_id', data.student_id); 
    formDatas.append('type', data.type); 
    const url = environment.apiUrl + serviceName;  
    const options = {
      headers: new HttpHeaders({ 
        'Authorization': 'Bearer ' + token,  
      })
    };  
    return this.http.post(url, formDatas, options);
  }

  createAssigmentQuestion(serviceName: string,data: any,token:any) {         
    const formDatas = new FormData();
    formDatas.append('topic_id', data.topic_id);
    formDatas.append('question', data.question);
    formDatas.append('a', data.a);
    formDatas.append('b', data.b);
    formDatas.append('c', data.c);
    formDatas.append('d', data.d);
    formDatas.append('answer', data.answer); 
    formDatas.append('answer_exp', data.answer_exp); 
    formDatas.append('testType', data.testType); 
    if(data.old_id){
      formDatas.append('id', data.old_id); 
    } 
    if(data.question_img){
      formDatas.append('question_img', data.question_img); 
    } 
    formDatas.append('i_assigned_class_subject_id', data.iacs);  
    const url = environment.apiUrl + serviceName;  
    const options = {
      headers: new HttpHeaders({ 
        'Authorization': 'Bearer ' + token,  
      })
    };
  
    return this.http.post(url, formDatas, options);
  }
}
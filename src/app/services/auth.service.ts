import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject,Observable } from 'rxjs';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import {AuthConstants} from '../../../config/auth-constants';

@Injectable({
providedIn: 'root'
})
export class AuthService {
userData$ = new BehaviorSubject<any>([]);
constructor(
private httpService: HttpService,
private storageService: StorageService,
private router: Router
) {}


getUserData() {
  this.storageService.get(AuthConstants.AUTH).then(res => { 
     this.userData$.next(res);
  });
}

login(postData: any): Observable<any> { 
  return this.httpService.post('login', postData);
}

forgotAction(postData: any): Observable<any> { 
  return this.httpService.post('forgotAction', postData);
}

signup(postData: any): Observable<any> {
  return this.httpService.post('signup', postData);
}
register_student(postData: any): Observable<any> {
  return this.httpService.post('register_student', postData);
}
resendOtp(postData: any): Observable<any> {
  return this.httpService.post('resendOtp', postData);
}
updatepassword(postData: any): Observable<any> {
  return this.httpService.post('updatepassword', postData);
}

  logout( ) {  
    this.storageService.removeStorageItem(AuthConstants.AUTH).then(res => {
      this.userData$.next('');
      window.location.href = 'homepage';
      //this.router.navigate(['/']);
    });
  }
}
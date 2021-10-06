import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import 'select2';                      
import 'select2/dist/css/select2.css';
import { ToastService } from '../services/toast.service'; 
@Component({
  selector: 'app-add-test-unit',
  templateUrl: './add-test-unit.page.html',
  styleUrls: ['./add-test-unit.page.scss'],
})
export class AddTestUnitPage implements OnInit {
  postData = {
    unitName:''
  }
  iacs:any;
  units:any;
  subject:any; 
  previousUrl:any; 
  constructor( private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];   
        this.subject =  params['subject'];  
        if(this.iacs && this.subject){
          this.previousUrl = 'test?iacs='+this.iacs+'&subject='+this.subject;  
        } 
      }
    ) 
  }

}

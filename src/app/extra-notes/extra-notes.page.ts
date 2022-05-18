import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-extra-notes',
  templateUrl: './extra-notes.page.html',
  styleUrls: ['./extra-notes.page.scss'],
})
export class ExtraNotesPage implements OnInit {
  iacs:any;
  subject:any;
  lectureid:any;
  previousUrl:any;
  students:any;
  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit() { 
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs']; 
        this.subject =  params['subject']; 
        this.lectureid =  params['lectureid']; 
        if(this.iacs,this.subject){
          this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject; 
          this.getExtraNotes();
        }  
      }
    ) 
  }

  async getExtraNotes(){
    var token =  await this.storageService.get(AuthConstants.AUTH)   
    var data = {
      iacs:this.iacs,
      subject:this.subject,
    } 
    
  }

}

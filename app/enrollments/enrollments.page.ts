import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationEnd   } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service'; 
import { AuthConstants } from '../../config/auth-constants';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.page.html',
  styleUrls: ['./enrollments.page.scss'],
})
export class EnrollmentsPage implements OnInit { 
  iacs:any;
  subject:any;
  total:BigInteger;
  students:any;
  previousUrl:any;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() { 

      
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];  
        if(this.iacs && this.subject){   
          this.previousUrl = '/homepage';  
        }
      }
    ) 
    
      var token =  await this.storageService.get(AuthConstants.AUTH);
      await this.storageService.get(AuthConstants.AUTH)   
      if(this.iacs && this.subject){
        await this.homeService.enrollments(this.iacs,this.subject,token).subscribe(
          (res: any) => {   
            setTimeout(() => {
              this.total = res.students.length;
              this.students = res.students[0].student;  
            }, 2000);
          }
        )   
    } 

  }

}

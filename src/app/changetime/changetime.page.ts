import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router'; 
import { StorageService } from '../services/storage.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { StudentService } from '../services/student.service'; 
@Component({
  selector: 'app-changetime',
  templateUrl: './changetime.page.html',
  styleUrls: ['./changetime.page.scss'],
})
export class ChangetimePage implements OnInit {
  iacs:string;
  subject:string;
  previousUrl:string; 
  slots:any; 
  constructor( 
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private StudentService: StudentService,
    ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];     
        this.previousUrl = 'subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1'; 
        this.getTimings(this.iacs,this.subject);  
      }
    )
  }
  async getTimings(iacs,subject){
    var token =  await this.storageService.get(AuthConstants.AUTH)  
    var data = {
      iacs:iacs,
      subject:subject,
    }
    this.StudentService.getTimings(data,token).subscribe(
      (res: any) => {
        if(res.status == 200){     
          this.slots = res?.slots;
        } 
      }); 
  }

}

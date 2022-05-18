import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-doubts',
  templateUrl: './doubts.page.html',
  styleUrls: ['./doubts.page.scss'],
})
export class DoubtsPage implements OnInit {
  subject:any;
  iacs:any;
  previousUrl:any;
  alldoubts:any;
  nodoubt:any;
  constructor( private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute, ) { }

    async ngOnInit() {
      var token =  await this.storageService.get(AuthConstants.AUTH);  
      this.route.queryParams.subscribe(
        params => { 
          this.iacs =  params['iacs']; 
          this.subject =  params['subject'];  
          if(this.iacs && this.subject){
            this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject;  
            this.loadDoubts(this.iacs,token);
          }
        });
    }


    async onInput(e){
      var name = e.target.value;
      var token =  await this.storageService.get(AuthConstants.AUTH)   
      if(name){
        await this.homeService.loadDoubtsByname(name,this.iacs,token).subscribe(
          (res: any) => { 
            if (res.status == 200) { 
              this.alldoubts = res.data; 
            }
          });
        }else{
          this.loadDoubts(this.iacs,token);
        }
    }
    
    onCancel(e){ 
    }

    async loadDoubts(iacs,token){
      await this.homeService.loadDoubts(iacs,token).subscribe(
        (res: any) => { 
          if (res.status == 200) {
            this.alldoubts = res.data;  
           
            if(this.alldoubts.length > 0){
              this.nodoubt = false;
            }else{
              this.nodoubt = true;
            }
          }
        }); 
    }

}

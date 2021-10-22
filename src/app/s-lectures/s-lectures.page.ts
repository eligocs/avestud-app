import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
@Component({
  selector: 'app-s-lectures',
  templateUrl: './s-lectures.page.html',
  styleUrls: ['./s-lectures.page.scss'],
})
export class SLecturesPage implements OnInit {
    previousUrl: any;
    iacs: any;
    subject: any;
    purchased: any;
  constructor( 
    private route: ActivatedRoute,
  ) { }

  ngOnInit() { 
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];
        this.subject = params['subject']; 
        this.purchased = 1;
        /* if(this.purchased){
          this.previousUrl = '/subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased='+this.purchased; 
        }  */
        if(this.purchased){
          this.previousUrl = '/subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased='+this.purchased; 
        } 
      }
    ) 


  }

}

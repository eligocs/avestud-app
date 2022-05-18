import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StudentService } from '../services/student.service';
import { StorageService } from '../services/storage.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import $ from 'jquery';

@Component({
  selector: 'app-s-assignments',
  templateUrl: './s-assignments.page.html',
  styleUrls: ['./s-assignments.page.scss'],
})
export class SAssignmentsPage implements OnInit {
  subject:any;
  iacs:any;
  assignment_old_unit:any;
  topics:any;
  previousUrl:any;
  hideOlds:any;
  nodata:any;
  showUnitFor:any;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) { }

  async ngOnInit() {

    $(document).ready(function(){
      $(document).on("click",".toogle_text",function() {
        $(this).toggleClass('text_wrap');
      });
    });    

    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];
        this.subject = params['subject'];   
        if(this.subject && this.iacs && token){ 
            this.previousUrl = '/subject-detail-student?iacs='+this.iacs+'&subject='+this.subject+'&purchased=1'; 
            this.loadstudentAssign(this.iacs,this.subject,token);  
        }
      }
    ) 
  }
  toggleShow(unit) {
    if(unit){
      this.showUnitFor = unit;
    }else{
      this.showUnitFor = '';
    } 
  }
  async loadstudentAssign(iacs,subject,token){
    var newData = {
      iacs_id:iacs,
      subject:subject,
      token:token,
    }
    await this.studentService.getstudentAssignment(newData,token).subscribe(
      (res: any) => {    
        if (res.status == 200) {  
          this.assignment_old_unit = res.assignment_old_unit;  
          this.topics = res.topics;   
          if(this.topics.length > 0){
            this.nodata = false;
          }else{
            this.nodata = true;
          }    
        }
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StudentService } from '../services/student.service';
import { StorageService } from '../services/storage.service'; 
import { AuthConstants } from '../../../config/auth-constants';
@Component({
  selector: 'app-startassignment',
  templateUrl: './startassignment.page.html',
  styleUrls: ['./startassignment.page.scss'],
})
export class StartassignmentPage implements OnInit {
  instep:any;
  assignment:any;
  iacs:any; 
  questions:any;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) { }

  async ngOnInit() {
    this.instep = 1;
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => { 
        this.iacs =  params['iacs'];
        this.assignment = params['assignment'];   
        if(this.assignment){  
          this.startassignment(this.assignment,token);  
        }
      }
    ) 
  }
  
  async startassignment(assignment,token){ 
    var newData = { 
      assignment:assignment, 
    } 
    await this.studentService.startassignment(newData,token).subscribe(
      (res: any) => {    
        if (res.status == 200) { 
          this.questions = res.questions ?? '';
          console.log(res);   
        }
      }
    ); 
  }

}

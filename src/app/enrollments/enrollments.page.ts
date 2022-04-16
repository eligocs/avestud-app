import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Router,ActivatedRoute,NavigationEnd   } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import   jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.page.html',
  styleUrls: ['./enrollments.page.scss'],
})



export class EnrollmentsPage implements OnInit { 
    @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  iacs:any;
  subject:any;
  total:BigInteger;
  students:any;
  previousUrl:any;
  searchName:any;
  showloader:boolean; 
  class:'';
  student:'';
  enrolled_class:'';
  constructor(
    private router: Router,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute, 
  ) { }

  async ngOnInit() { 
    this.showloader = true; 
      
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
              this.total = res.students[0].student.length;
              this.students = res.students[0].student;  
              this.showloader = false;
            }, 2000);
          }
        )   
    } 

  }

  exportAsPDF(div_id)
  {
    let data = document.getElementById(div_id);  
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
      pdf.save('Filename.pdf');   
    }); 
  }

  async searchStudent(){
    this.showloader = true;
    this.students = '';
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(this.searchName.length > 2 && this.searchName.length < 10){
      await this.homeService.searchenrollments(this.iacs,this.subject,this.searchName,token).subscribe(
        (res: any) => {      
            this.total = res.students[0].student.length;
            this.students = res.students[0].student;   
            this.showloader = false;
          }
          ) 
    }else{
          if(this.iacs && this.subject){
        await this.homeService.enrollments(this.iacs,this.subject,token).subscribe(
          (res: any) => {    
            setTimeout(() => { 
              this.total = res.students[0].student.length;
              this.students = res.students[0].student;  
              this.showloader = false;
            }, 2000);
          }
          )   
        }
    } 
  }

  async downloadReceipt(class_id,student_id){ 
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(class_id &&  student_id){
      await this.homeService.downloadReceipt(class_id,student_id,token).subscribe(
      (res: any) => {  
        console.log(res)
        this.class = res.data.class;
        this.student = res.data.student;
        this.enrolled_class = res.data.enrolled_class;
      }) 
    }
  }

}

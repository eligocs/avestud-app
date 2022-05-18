import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Router,ActivatedRoute,NavigationEnd   } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import $ from 'jquery';
import   jspdf from 'jspdf';
import html2canvas from 'html2canvas'; 
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
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
  text:any;
  total_amount:any;
  class:any;
  student:any;
  enrolled_class:any;
  institute_name:any;
  free_trial:any;
  discount_in_rs:any;
  pay_id:any;
  showloader:boolean; 
  constructor(
    private router: Router,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute, 
    public platform: Platform, 
    public androidPermissions: AndroidPermissions
  ) {
    platform.ready().then(() => {
    
      this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.CAMERA, 
          this.androidPermissions.PERMISSION.CALL_PHONE, 
          this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        ]
      ); 
   
    }) 
   }

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

  async exportAsPDF(div_id,class_id,student_id)
  {   

    

    $('#page_loader').show();
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(class_id &&  student_id){
      await this.homeService.downloadReceipt(class_id,student_id,token).subscribe(
      (res: any) => {  
       if(res.status == 200){
        this.class = res.class;
        this.student = res.student;
        this.enrolled_class = res.enrolled_class;
        this.pay_id = res.pay_id;
        this.free_trial = res.free_trial;
        this.total_amount = res.total_amount;
        this.discount_in_rs = res.discount_in_rs;
        this.text = res.text;
        this.institute_name = res.institute_name; 
          setTimeout(() => { 
              $('#receiptPdf').show();
              $('#receiptPdf').addClass('print_receipt');
              let data = document.getElementById(div_id);   
              html2canvas(data).then(canvas => {   
                $('#receiptPdf').removeClass('print_receipt');
                const pdf = new jspdf({
                  orientation: "portrait", // landscape or portrait
                  unit: "mm",
                  format: "a4",
                });
              let width = pdf.internal.pageSize.getWidth()
              let height = pdf.internal.pageSize.getHeight() 
              let widthRatio = width / canvas.width
              let heightRatio = height / canvas.height 
                let ratio = widthRatio > heightRatio ? heightRatio : widthRatio 
                pdf.addImage(
                  canvas.toDataURL('image/jpeg', 1.0),
                  'JPEG', 2, 2, canvas.width * ratio,canvas.height * ratio
                  )
                  
                    pdf.save('test.pdf');
                  
                  $('#page_loader').hide();   
                  $('#receiptPdf').hide();   
              }); 
            }, 1000);
        } 
      });
    } 
   
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
        this.class = res.data.class;
        this.student = res.data.student;
        this.enrolled_class = res.data.enrolled_class;
      }) 
    }
  }

}

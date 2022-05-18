import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { StudentService } from '../services/student.service';
import { ActivatedRoute  } from '@angular/router';
import { HomeService } from '../services/home.service';  
import $ from 'jquery';
import   jspdf from 'jspdf';
import html2canvas from 'html2canvas'; 
@Component({
  selector: 'app-recipt-student',
  templateUrl: './recipt-student.page.html',
  styleUrls: ['./recipt-student.page.scss'],
})
export class ReciptStudentPage implements OnInit {
  nodata:any;
  recipts:any;
  total_amount:any;
  discount_in_rs:any;
  class:any;
  student:any;
  free_trial:any;
  pay_id:any;
  text:any;
  institute_name:any;
  enrolled_class:any;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private homeService: HomeService,
  ) { }

  async ngOnInit() { 
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => {      
        this.loadRecipts(token);     
      }
    ) 
  }

  async exportAsPDF(div_id,class_id,student_id)
  {  
    $('#page_loader').show();
    var token =  await this.storageService.get(AuthConstants.AUTH);
    if(class_id &&  student_id){
      await this.studentService.downloadReceipt(class_id,student_id,token).subscribe(
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
                  pdf.save('receipt.pdf'); 
                  $('#page_loader').hide();   
                  $('#receiptPdf').hide();   
              }); 
            }, 1000);
        } 
      });
    } 
   
  }

  async loadRecipts(token){
    await this.studentService.loadRecipts(token).subscribe(
      (res: any) => {    
        if (res.status == 200) {   
          this.recipts = res.data;   
          if(this.recipts.length > 0){
            this.nodata = false;
          }else{
            this.nodata = true;
          }    
        }
      }
    );
  }

}

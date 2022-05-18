import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { StudentService } from '../services/student.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import { PreviousRouteService } from '../previous-route.service';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';   
import $ from "jquery"
@Component({
  selector: 'app-searchclass',
  templateUrl: './searchclass.page.html',
  styleUrls: ['./searchclass.page.scss'],
})
export class SearchclassPage implements OnInit {
  postData = {
    category: '',  
  };
  classes:any;
  categories:any;
  selected_cat:any;
  previousUrl:any;
  iacsdetails:any;
  nodata:any;
  timeslots:any;
  showloader:boolean;
  show_default:boolean;
  enteredName:any
  constructor( 
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private StudentService: StudentService,
    public alertController: AlertController,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() { 

    $(document).ready(function(){
      $(document).on('click','.read_more',function(){ 
        $(this).parent().find('p').toggle();
        $(this).parent().parent().find('.lessdata').toggle();
        if ($(this).parent().parent().find('.lessdata').is(":visible")) {
          $(this).html('<i class="fa fa-arrow-down"></i> Read More');
        }else{
          $(this).html('<i class="fa fa-arrow-up"></i> Read Less');
        }
      });
    });

    this.showloader = false;
    this.show_default = true;
    var token =  await this.storageService.get(AuthConstants.AUTH);  
    var userdetails =  await this.storageService.get(AuthConstants.userdetails); 
    var mainThis = this; 
    this.previousUrl = '/studenthome'; 
    if(!userdetails){
      this.router.navigate(['/']);
    }else{  
      await this.StudentService.getcats(token).subscribe(
        (res: any) => {  
          if (res.categories) { 
            this.categories =  res.categories;  
          }
        }) 
      } 
 
      this.route.queryParams.subscribe(
        params => { 
          if(params['selected_cat']){
            this.selected_cat = params['selected_cat'];
            this.oncatChange(); 
          }
        }
      )
    }
    async setName(){
      
      if(this.enteredName.length > 1 && this.enteredName.length < 15){ 
          var detailA = {
            class : this.enteredName
          }
          var token =  await this.storageService.get(AuthConstants.AUTH)
          this.StudentService.getstudentclassByname(token,detailA).subscribe(
            (res: any) => {  
              if (res.status == 200) {  
                var result =  res.classes ? res.classes :'';   
                var allClasses = [];   
                
                  if(result.length > 0){
                    result.forEach((entry,i) => { 
                      entry.subjects.forEach((subj) => {  
                        subj.color_code = this.colorLight(i);  
                      });    
                      allClasses.push(entry)
                      if(i == result.length -1){
                        if(allClasses){ 
                          this.classes = allClasses; 
                        }else{
                          this.classes = ''; 
                          this.nodata = false;
                        }
                      }
                    }); 
                    if(this.classes.length > 0){
                        this.nodata = false;
                    } else {
                        this.nodata = true;
                      } 
                  }     
              }
              this.show_default = false;
              this.showloader = false;
            })  
      }else{ 
        this.classes = [];
        this.show_default = false;
        this.showloader = false;
        this.oncatChange(); 
      } 
    }
    
    async oncatChange(){ 
      this.classes  = {};
      this.showloader = true;
      this.nodata = false; 
      if(this.selected_cat){
        var detail = {
          category_id : this.selected_cat
        }
        if(this.selected_cat){
          this.enteredName = '';
        }
        var token =  await this.storageService.get(AuthConstants.AUTH)
        await this.StudentService.getstudentclass(token,detail).subscribe(
          (res: any) => {  
            if (res.status == 200) {  
              var result =  res.classes;   
              var allClasses = [];  
              console.log(res.classes)
              if(result.length > 0){
                result.forEach((entry,i) => { 
                  entry.subjects.forEach((subj) => {  
                    subj.color_code = this.colorLight(i);  
                  });    
                  allClasses.push(entry)
                  if(i == result.length -1){ 
                    if(allClasses){ 
                      this.classes = allClasses; 
                    }else{
                      this.classes = ''; 
                      this.nodata = true;
                    }
                  }
                });  
              }else{
                this.classes = ''; 
                this.nodata = true;
              }   
            }
            this.show_default = false;
            this.showloader = false;
          }) 
      } 
    }
    colorLight(i) {  
       var items = ['grad_sky','grad_yellow','grad_yellow','grad_green','grad_orange']
        return items[Math.floor(Math.random()*items.length)]; 
     }
    async presentAlert(id) {
     var token = await this.storageService.get(AuthConstants.AUTH);  
     var toast = this.toastService;
     var serv_student = this.StudentService; 
     var mainthis = this; 
     const alert = await this.alertController.create({
       cssClass: 'my-custom-class',
       header: 'Confirm!',
       message: 'Are you sure you want to enroll this class!!!',
       buttons: [
         {
           text: 'No',
           role: 'cancel',
           cssClass: 'secondary',
           handler: (blah) => {
             
           }
         }, {
           text: 'Yes',
           handler: function() {   
              window.location.href = 'selecttimings/?id='+id;
           }
         }
       ]
     });
 
     await alert.present();
   }

}

import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { StudentService } from '../services/student.service'; 
import { AuthConstants } from '../../../config/auth-constants';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import { PreviousRouteService } from '../previous-route.service';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';  
@Component({
  selector: 'app-searchclass',
  templateUrl: './searchclass.page.html',
  styleUrls: ['./searchclass.page.scss'],
})
export class SearchclassPage implements OnInit {
  classes:any;
  categories:any;
  selected_cat:any;
  previousUrl:any;
  iacsdetails:any;
  nodata:any;
  timeslots:any;
  showloader:boolean;
  show_default:boolean;
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
    
    
    async oncatChange(){
      this.classes  = {};
      this.showloader = true;
      this.nodata = false;
      var token =  await this.storageService.get(AuthConstants.AUTH);  
      if(this.selected_cat){
        await this.StudentService.getstudentclass(token,this.selected_cat).subscribe(
        (res: any) => {  
          if (res.status == 200) {  
            var result =  res.classes;   
            var allClasses = []; 
            if(result.length > 0){
              result.forEach((entry,i) => { 
                entry.subjects.forEach((subj) => {  
                  subj.color_code = colorLight(i);  
                });    
                allClasses.push(entry)
                if(i == result.length -1){
                  this.classes = allClasses; 
                }
              });
              console.log(allClasses)
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
      }
   

    function colorLight(i) {  
       var items = ['grad_sky','grad_yellow','grad_yellow','grad_green','grad_orange']
        return items[Math.floor(Math.random()*items.length)]; 
     }
     
     
     
    }
    async presentAlert(id) {
     var token = await this.storageService.get(AuthConstants.AUTH);  
     var toast = this.toastService;
     var serv_student = this.StudentService; 
     var mainthis = this;
    
    /*  function enrollclass(id){
        serv_student.enrollclass(id,token).subscribe(
        (res: any) => {
          this.iacsdetails = res.iacsdetails; 
          this.timeslots = res.timeslots; 
           mainthis.getallectures(mainthis.iacs,token);
          toast.presentToast(res.msg);
        }); 
     } */
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

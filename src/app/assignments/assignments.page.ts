import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { StorageService } from '../services/storage.service'; 
import { HomeService } from '../services/home.service';
import { BehaviorSubject,Observable } from 'rxjs';
import { AuthConstants } from '../../../config/auth-constants';
import { PreviousRouteService } from '../previous-route.service';  
import { ToastService } from '../services/toast.service';  
import { AlertController,ModalController  } from '@ionic/angular';  
import { ModalPage } from '../modal/modal.page';
import 'sweetalert2/src/sweetalert2.scss';
import $ from "jquery";
@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.page.html',
  styleUrls: ['./assignments.page.scss'],
})
export class AssignmentsPage implements OnInit {
  iacs:string;
  subject:string;
  previousUrl:string; 
  assignments:any; 
  assignmet_w_n_t:any; 
  showUnitFor:any; 
  hideOlds:any;
  noassignments:boolean; 
  assignment:any; 
  constructor(
    public modalController: ModalController,
    private previousRouteService: PreviousRouteService,
    private storageService: StorageService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    private toastService: ToastService

  ) { }   
 
  async ngOnInit() {   
    // Custom_popover / Dropdown Menu 
    $(document).ready(function(){
    $(function() { // Dropdown toggle
      $(document).on('click', '.toggle1', function() { 
        $(this).next('.dropdown1').slideToggle();
      });
      });
    });
   // Custom_popover / Dropdown Menu  end

   
    this.assignment = 'assignment';
    var token =  await this.storageService.get(AuthConstants.AUTH);
    this.route.queryParams.subscribe(
      params => {
        this.iacs =  params['iacs']; 
        this.subject =  params['subject'];  
        this.getAssignments(this.iacs,token);
        this.previousUrl = 'subject-detail?iacs='+this.iacs+'&subject='+this.subject;  
      }
    )
  }
  async getAssignments(iacs,token){
    if(iacs && token){    
      await this.homeService.openAssignments(iacs,token).subscribe(
        (res: any) => {    
          if(res.status == 200){
            this.assignments = res.topics ? res.topics:'';  
            this.assignmet_w_n_t = res.assignmet_w_n_t ? res.assignmet_w_n_t:'';  
            if(this.assignmet_w_n_t.length > 0){
              this.hideOlds = true;   
            }else{
              this.hideOlds = false;    
            }   
          }else{
            this.noassignments = false;   
            this.assignments = [];       
          }
          if(res.topics.length > 0){
            this.noassignments = false;   
          }else{
            this.noassignments = true;    
          }    
      }); 
    }  
  }

  toggleShow(unit) {
    if(unit){
      this.showUnitFor = unit;
    }else{
      this.showUnitFor = '';
    } 
  }

  async presentAlert(id) {
 
    var token = await this.storageService.get(AuthConstants.AUTH);  
    var toast = this.toastService;
    var serv_home = this.homeService; 
    var mainthis = this;
    function delete_l(id){
      serv_home.delAssignment(id,token).subscribe(
        (res: any) => {   
          mainthis.getAssignments(mainthis.iacs,token);
           
        }); 
      }
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Confirm!',
        message: 'Are you sure you want to delete this lecture!!!',
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
           
            delete_l(id); 
          }
        }
      ]
    }); 
    await alert.present();
  }

}

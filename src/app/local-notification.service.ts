import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  constructor() { }


  async showLocalNotification(id : number, title : string, text : string,time:any){   
    LocalNotifications.schedule({
      notifications:[
        {
            title : title,
            body : text,
            id : id,
            schedule: { at: new Date(time)  },
            sound: "splash.mp3",
            smallIcon:'notification_icon',
            iconColor:'#0000ff', 

        }
      ]
    });
  } 
}

import Peer from 'peerjs';
import $ from 'jquery';
import { CallPage } from '../call/call.page';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ComponentFactoryResolver } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { AuthConstants } from '../../../config/auth-constants';
interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}
export class WebrtcService {
  CallPage: CallPage;
  peer: Peer;
  studentStream: any;
  context: any;
  myStream: any;
  recordVideoEl: any;
  myEl: HTMLMediaElement;
  studentEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  teacherEl: HTMLMediaElement;
  recordedVideo: HTMLMediaElement;
  onlineEl: any;
  options: any;
  audioMute: any;
  remote_student_video: any;
  students: any[] = [];
  type: any;
  userId: any;
  lectureid: any;
  isTeacherStreaming: any;
  conn: any;
  recorder: any;
  facingMode: any;
  stun = 'stun.l.google.com:19302';
  /*  mediaConnection: Peer.MediaConnection;
   options: Peer.PeerJSOption; */
  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun,
  };

  constructor() {

    this.options = {  // not used, by default it'll use peerjs server
      key: '907e35f4142ca0ec0373a1e36e80bd378aab0718',
      debug: 3
    };
  }

  getMedia() { 
    // alert(this.facingMode)
    var mainthis = this;  
    var constraints = {
      audio: true,
       video:  {
        facingMode:this.facingMode, 
        minWidth: 1280,
        minHeight: 720, 
        maxWidth: 1920,
        maxHeight: 1080, 
        minFrameRate: 3,
        maxFrameRate: 32,
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) { 
        mainthis.myStream = stream;
        mainthis.myEl.srcObject = stream; 
      })
      .catch(function (err) {

      });
  }

  stop() {
    var mainThis = this;
    var stream = this.myStream;
    if (stream) {
      if(this.students.length > 0){ 
        this.students.forEach(function (std) {
          var conn = mainThis.peer.connect(std.id.toString());
          var data = {
            isOffline: true, 
          }
          conn.on('open', function () {
            conn.send(data);
          });
        });
      }
      stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
      this.isTeacherStreaming = false;
      this.onlineEl.html('<a style="color: #cf3b1e; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
      
      return true; 
    }else{
      return false;
    }
  }

  mutevideo(status) {
    var mainThis = this;
    if (this.students.length > 0) {
      this.students.forEach(function (std) {
        var conn = mainThis.peer.connect(std.id.toString());
        var data = {
          ismuted: true,
          status: status,
        }
        conn.on('open', function () {
          conn.send(data);
        });
      });
      if (status == true) {
        this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Audio Muted</span>');
      } else {
        this.audioMute.html('');
      }
    }
    var stream = this.myStream;
    if (stream) {
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
    }
  }

  listAll() {
    this.peer.listAllPeers(list => console.log(list));
  }

  flipcam(){
    if(this.facingMode == 'user'){
      this.facingMode = 'environment';
    } else{
      this.facingMode = 'user';
    }
    this.getMedia(); 
  }

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement, studentEl: HTMLMediaElement, type: string, students: any,lectureid:any) {
     this.onlineEl = $('.onlineEl');
    this.audioMute = $('.audioMute');
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    this.studentEl = studentEl;
    this.userId = userId;
    this.lectureid = lectureid;
    this.type = type; 
    this.facingMode = 'user'; 
    if (myEl) {
      try {
        this.getMedia();
      } catch (e) {
        this.handleError(e);
      }
    }
    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.peer.on('call', (call) => {
        if(this.type == 'student'){ 
          call.answer(this.myStream);
          call.on('stream', (stream) => { 
            if(this.remote_student_video){
              this.remote_student_video.srcObject = stream; 
            }else{
              this.partnerEl.srcObject = stream;
            } 
          });
          $('#partner-video').css({
            'transform': 'scaleX(-1)'
          });
        }
        this.onlineEl.html('<a style="color: #00bc35; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>'); 
        if(this.type == 'institute'){ 
          call.answer(this.myStream);
          call.on('stream', (stream) => {  
            this.studentStream = stream; 
        });
        call.on('close', () => { 
        });
      }
      });
    });
    var mainThis = this;
    this.peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        mainThis.appendStudent(data);
      });
    });
  }
  showOnline() {
    this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
  }

  pauseVideo(status, teacher) {
    var mainThis = this;
    if (this.students.length > 0) {

      this.students.forEach(function (std) {
        var conn = mainThis.peer.connect(std.id.toString());
        var data = {
          ispaused: true,
          pauseStatus: status,
        }
        conn.on('open', function () {
          conn.send(data);
        });
      });
      if (status == true) {
        this.onlineEl.html('<a style="color: #cf3b1e; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
        this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Video Paused</span>');
      } else {
        this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
        this.audioMute.html('');
      }
    }
  }

  stopStudent(){
    var stream = this.myStream;
    var mainThis = this;
    if (stream) {
      if(this.students.length > 0){ 
        this.students.forEach(function (std) {
          var conn = mainThis.peer.connect(std.id.toString());
          var data = {
            studentPaused: true, 
          }
          conn.on('open', function () {
            conn.send(data);
          });
        });
      }
      stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
    }
  }

  destroyPeer() {
    this.peer.destroy()
    this.peer.disconnect()
  }
  appendStudent(data) {
    var mainThis = this;


   /*  if (data.studentCall == true) {
      var student = data.userdetails.id;
      var index = this.students.findIndex(function (o) {
        return o.id === student;
      })
      if (index !== -1) {
        this.students.splice(index, 1);
      };
      this.students.push(data.userdetails) 
     
    } */

    if (data.setupMembers == true) {
      var student = data.userdetails; 
      this.studentStream = this.myStream;   
      return;
    }

    if (data.studentPaused == true) {
      var student = data.userdetails; 
        $('#student_msg').html(student.name.toUpperCase()+' paused preseting'); 
        setTimeout(() => { 
          $('#student_msg').html(''); 
        }, 6000);    
      return;
    }

    if (data.studentStopped == true) {
      var student = data.userdetails; 
        $('#student_msg').html('Student stopped preseting'); 
        setTimeout(() => { 
          $('#student_msg').html(''); 
        }, 6000);    
        $('#partner-video').css({'width':'100%','height':'400px','object-fit': 'cover'});  
        $('#remote_student_video').remove(); 
      return;
    }

    if (data.pauseSAudio == true) {
      var studentname = data.name; 
      if(data.status == true){ 
        $('#student_msg').html('Your audio is muted by teacher');   
      }else{
        $('#student_msg').html('Your audio is unmuted'); 
      }
      this.myStream.getAudioTracks()[0].enabled = !(this.myStream.getAudioTracks()[0].enabled); 
      setTimeout(() => { 
        $('#student_msg').html('');  
      }, 6000);    
      return;
    }

    if (data.pauseSVideo == true) {
      var studentname = data.name; 
      if(data.status == true){ 
        $('#student_msg').html('Your video is paused by teacher');   
      }else{
        $('#student_msg').html('Your video continued'); 
      }
        this.myStream.getVideoTracks()[0].enabled = !(this.myStream.getVideoTracks()[0].enabled); 
        setTimeout(() => { 
          $('#student_msg').html('');  
        }, 6000);    
      return;
    }

    if (data.streamToall == true) { 
      var studentName = data.studentName; 
      var student = data.student; 
        $('#student_msg').html(studentName.toUpperCase()+' presenting question'); 
        setTimeout(() => { 
          $('#student_msg').html(''); 
        }, 6000);    
        $('#partner-video').css({'width':'50%','object-fit': 'cover','float':'left'}); 
        var video = document.createElement('video'); 
        video.setAttribute('autoplay', '');
     /*    video.setAttribute('height', '400px'); */
        video.setAttribute('width', '50%');  
        video.setAttribute('playsinline', '');
        video.volume = 0;
        video.setAttribute('class', 'remote_student_video');
        video.setAttribute('id', 'remote_student_video'); 
        video.setAttribute('style', 'transition: transform 0.8s;-webkit-transform: scaleX(-1);transform: scaleX(-1);object-fit:cover');  
        $('#demoicon').append(video);
        this.remote_student_video = document.querySelector('#remote_student_video');  
        console.log(data.fullscreen)
        if(data.fullscreen){
          $('#remote_student_video').css({'float':'right','position':'fixed'});   
          $('#partner-video,#remote_student_video').css({'height':'100%'}); 
          
        }else{ 
          $('#remote_student_video').css({'position':'absolute'});   
          $('#partner-video,#remote_student_video').css({'height':'400px'}); 
          
        }
        /* this.remote_student_video.srcObject = this.myStream */
        // this.peer.call(data.student.id.toString(), this.myStream); 
      return;
    }

    if (data.allowStudent == true) {
        $('#student_msg').html('Present your question...'); 
        var student_id = data.student_id;
        var name = data.name; 
        this.students = data.allstudents;   
        $('.onRaiseHand').css({'background': 'linear-gradient(6deg, rgb(8 143 182), rgb(55 192 204))','color': 'white','border-radius': '4px;'}).html('Present your question').removeClass('orange_btn').attr('disabled',true);
        this.streamFromstudent(student_id,name,this.userId,this.students);

        

        setTimeout(() => { 
          $('#student_msg').html(''); 
        }, 6000);    
        // $('.student_has_question').html('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #470505, #d41616);color: white;border-radius: 4px;" class="btn_theme_live  streamStopstudent"  data-id="'+student_id+'"><i class="fa fa-desktop"></i> Stop</button>')
        /* $('.student_has_question').html('<button style="height: 36px;margin: 4px;background:linear-gradient(6deg, #365209, #72a52c);color: white;border-radius: 4px;" class="btn_theme_live  streamFromstudent"  data-id="' + student_id + '"><i class="fa fa-desktop"></i> Present Question</button>');  */
        // $('#partner-video').css({'width':'50%','height':'350px','right': '0'}); 
      return;
    }

    if (data.isOffline == true) {
        $('#student_msg').html('Teacher stopped presenting');  
        setTimeout(() => { 
          $('#student_msg').html(''); 
        }, 6000);     
        this.onlineEl.html('<a style="color:#cf3b1e; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
        //window.location.reload()
      return;
    }

    

    if (data.ismuted == true) {
      if (data.status == true) {
        this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Audio Muted</span>');
      } else {
        this.audioMute.html('');
      }
      return;
    }

    if (data.stopRaisehand == true) {  
      $('#student_msg').html('Tap Finish to end question');
      $('.onRaiseHand').css({'background': 'linear-gradient(6deg, rgb(78 182 8), rgb(74 132 15))','color': 'white','border-radius': '4px;'}).html('Finish').removeClass('orange_btn').attr('disabled',false);
      /* $('#my-video').css({'width':'100%','height':'400px','position':'absolute'});  
      $('#my-video-el').css({'width':'100px','height':'100px','right': '0','bottom':'0'}); */
     /*  this.studentEl.srcObject = null; 
      if(this.recordVideoEl){
        this.recordVideoEl.srcObject  = this.myStream;
      } */
      setTimeout(() => { 
        $('#student_msg').html('');   
      }, 6000);
      return;
    }

    if (data.ispaused == true) {
      if (data.pauseStatus == true) {
        this.onlineEl.html('<a style="color: #cf3b1e; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
        this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Video Paused</span>');
        $('.streaming_btn').attr('disabled',false).removeClass('streaming_btn'); 
        $('.leavebtn').attr('disabled',true); 
        $('.pausebtn').attr('disabled',true); 
        $('.onRaiseHand').attr('disabled',true);  
      } else {
        this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
        this.audioMute.html('');
        $('.streaming_btn').attr('disabled',true).removeClass('streaming_btn'); 
        $('.leavebtn').attr('disabled',false); 
        $('.pausebtn').attr('disabled',false); 
        $('.onRaiseHand').attr('disabled',false);  
      }
      return;
    } 
    if (data.isPresenting == true) { 
      var student = data.userdetails.id;
      var index = this.students.findIndex(function (o) {
        return o.id === student;
      })
      if (index !== -1) {
        this.students.splice(index, 1);
      };
      this.students.push(data.userdetails) 
    } else {
      if (data.diconnect == true) {
        var student = data.student;
        var index = this.students.findIndex(function (o) {
          return o.id === student;
        })
        if (index !== -1) {
          this.students.splice(index, 1);
        };
        $('#total_students').html(data.userdetails.name+' left the class');  
      } else {
        if (data.handRaised == true) {
         
          var student = data.userdetails.id;
          var index = this.students.findIndex(function (o) {
            return o.id === student;
          })
          if (index !== -1) {
            this.students.splice(index, 1);
          };
          this.students.push(data.userdetails) 
          $('#total_students').html(data.userdetails.name+' has a question ?'); 
        } else if (data.handRaised == false) {
          var student = data.userdetails.id;
          var index = this.students.findIndex(function (o) {
            return o.id === student;
          })
          if (index !== -1) {
            this.students.splice(index, 1);
          };
          this.students.push(data.userdetails)
        } else {
          $('#total_students').html(data.userdetails.name+' joined the class');  
          if (data.userdetails) {
            var student = data.userdetails.id;
            var index = this.students.findIndex(function (o) {
              return o.id === student;
            })  
            if (index !== -1) {
            }else{
              this.students.push(data.userdetails) 
            }
            if(mainThis.isTeacherStreaming){
              mainThis.peer.call(data.userdetails.id.toString(), mainThis.myStream);
            }
          }
        }
      }
    }


    /* if (data.handRaised == true) { 
      var imageAvatar = data.userdetails.avatar ? data.userdetails.avatar : "";
      $('#raiseHand').html('<ion-row ><ion-col size="3"> <div class="shedule_card"> <img style="min-height:100px;"            src='+imageAvatar+' alt="student_img.jpg"></div></ion-col><ion-col size="9"><div class="shedule_card ion-text-center">'+data.userdetails.name+' raised hand !</div></ion-col></ion-row>'); 
      return;
    } */
   
    setTimeout(() => {
      var total_students = this.students.length;
      $('#total_students').html(total_students);   
    }, 6000);
    $('#studentdiv').html('')

    
    var html = "";
    var itemsProcessed = 0;
    if (this.students.length > 0) {
      if (data.handRaised == true || data.isPresenting == true) {
        var stds = this.students.reverse();
      } else {
        var stds = this.students;
      }
       
      stds.forEach(function (std) {
        itemsProcessed++; 
        var image = std.avatar ? std.avatar : "";
        html += '<div class="student-video-section"> <ion-row style="background: linear-gradient(130deg,#385169 -12%, #385169 12%, #385169 18%,#1f1e1e 74%);border: 1px solid #848484;border-radius: 4px;" class="background_students student-' + std.id + '"><ion-col size="2"><div class=""> <img  class="student_image" style="min-height: 46px;max-width: 100%;border-radius: 34px;" src=' + image + ' alt="student_img.jpg"></div></ion-col><ion-col size="10"><div class="student-details addRaised"><h4>' + std.name + ' <span class="myonlinestatus"></span> <a style="color: #17b117; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a></h4>&nbsp;<button style="height: 36px;margin-top: 12px;margin-left: 6px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live pauseSAudio" data-name="'+name+'"  data-id="' + std.id + '"> <i class="fa fa-microphone"></i></button> <button style="height: 36px;margin-top: 12px;margin-left: 6px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live pauseSVideo" data-name="'+std.name+'"  data-id="' + std.id + '"> <i class="fa fa-pause"></i></button><button  style="height: 36px;margin-top: 12px;margin-left: 6px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;"         data-lecture="'+mainThis.lectureid+'" data-id="'+std.id+'"   class="mark_student_attendance"> <i class="fa fa-check-circle"></i></button></div></ion-col></ion-row></div>';
        // html += '<ion-row class="background_students student-' + std.id + '"><ion-col size="3"> <div class=""> <img class="student_image" src=' + image + ' alt="student_img.jpg"></div></ion-col><ion-col size="9"><div class="student-details addRaised"><h4>' + std.name + ' <a style="color: #17b117; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a></h4></div></ion-col></ion-row>';
        if (itemsProcessed === mainThis.students.length) {
          $('#studentdiv').html(html);
        }
        setTimeout(() => { 
          if (std.isPresenting == 1) { 
            setTimeout(() => {
              $('#total_students').html(data.name+' is presenting');
            }, 1000);
            $('.student-' + data.id).find('.addRaised').append('<button style="height: 36px;margin-top: 12px;margin-left: 6px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live studentRaised"  data-id="' + data.id + '"><i class="fa fa-desktop"></i> Student is presenting ...</button>');
          } else {
            if (std.handRaised == 1) {
              $('.student-' + std.id).find('.addRaised').append('<button style="height: 36px;margin-top: 12px;margin-left: 6px;background: linear-gradient(6deg, #a53939, #da4c4c);color: white;border-radius: 4px;" class="btn_theme_live studentRaised" data-name="'+std.name+'"  data-id="' + std.id + '"><i class="fa fa-question"></i></button><button style="height: 36px;margin-top: 12px;margin-left: 6px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live streamStopstudent" data-name="'+name+'"  data-id="' + std.id + '"> <i class="fa fa-close"></i></button>')
            } else {
              $('.student-' + std.id).find('.addRaised').find('.studentRaised').remove();
            }
          }
        }, 500);
        
      })
      $('.addRaised').css({'display': 'flex'}); 
      
    } else {
      $('#studentdiv').html('<ion-row "><ion-col size="12"><div class="shedule_card ion-text-center">No students Yet !</div></ion-col></ion-row>');
    }
  }


   

  pauseSAudio(id,name,status){
    var conn = this.peer.connect(id.toString());
    if(status == true){
      $('#total_students').html(name+' audio muted'); 
    }else{
      $('#total_students').html(name+' audio unmuted'); 
    }
    var data = {
      pauseSAudio: true,
      student_id: id,
      name: name, 
      status: status, 
    } 
    conn.on('open', function () {
      conn.send(data);
    });
    setTimeout(() => {  
      $('#total_students').html(''); 
    }, 6000); 
  }

  pauseSVideo(id,name,status){
    var conn = this.peer.connect(id.toString());
    if(status == true){
      $('#total_students').html(name+' video paused'); 
    }else{
      $('#total_students').html(name+' video continued'); 
    }
    var data = {
      pauseSVideo: true,
      student_id: id,
      name: name, 
      status: status, 
    } 
    conn.on('open', function () {
      conn.send(data);
    });
  }

  allowStudent(id,name, teacher,fullscreen) {
    var mainThis = this; 

    var student = id;
    var index = this.students.findIndex(function (o) {
      if(o.id === student){
        o.handRaised = ''; 
        o.isPresenting = 1; 
        return o.id === student;
      }
    }) 
      
    $('.recordCanvas').css({'width':'50%','height':'500px','left': '0','object-fit': 'cover','float':'left'}); 
    if(fullscreen){
      $('#my-video').css({'width':'50%','height':'100%','left': '0','object-fit': 'cover','float':'left','min-width': '50%','bottom':'0'});  
      $('#my-video-el').css({'width':'50%','height':'100%','right': '0','z-index':'0','bottom':'0','position':'fixed'}); 
    }else{ 
      $('#my-video').css({'width':'50%','height':'400px','left': '0','object-fit': 'cover','float':'left','min-width': '50%'}); 
      $('#my-video-el').css({'width':'50%','height':'400px','right': '0','z-index':'0','position':'absolute'});  
    }
 /*    $('.student-' + id).find('.addRaised').append('<button style="height: 36px;margin-top: 12px;margin-left: 6px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live streamStopstudent" data-name="'+name+'"  data-id="' + id + '"> <i class="fa fa-close"></i></button>') */
    $('#gofullScreen').attr('id','gofullScreen2');
    if(this.studentStream){ 
        this.studentEl.srcObject = this.studentStream;  
        /* if(this.recordVideoEl){
          this.recordVideoEl.srcObject = this.studentStream;  
        } */
    }
    var conn = this.peer.connect(id.toString());
    var data = {
      allowStudent: true,
      student_id: id,
      name: name,
      allstudents:this.students, 
    } 
    conn.on('open', function () {
      conn.send(data);
    });

    this.students.forEach(function (student) {
      if(student.id != id){
        var con = mainThis.peer.connect(student.id.toString());
        var data = {
          streamToall: true, 
          student:student, 
          studentName:student.name, 
          fullscreen:fullscreen, 
        }
        con.on('open', function () {
          con.send(data);
        });
        //mainThis.peer.call(student.id.toString(), mainThis.myStream); 
      } 
    }) 
  }

  pauseRecording(){
    this.recorder.pauseRecording();
  }
  resumeRecording(){
    this.recorder.resumeRecording(); 
  }
  startRecord() {
    var mainThis = this;

    //var videoPreview = <HTMLMediaElement> document.getElementById('video-preview');
    var logoImage = <CanvasImageSource>document.getElementById('logo-image');
    var waitImage = <CanvasImageSource>document.getElementById('logo-image');


    var canvas = <CanvasElement>document.createElement('canvas');
    var context = canvas.getContext('2d');
    this.context = context;
    canvas.setAttribute('style', 'position: absolute; z-index: -1;display:none;');
    //canvas.setAttribute('style', 'transition: transform 0.8s;-webkit-transform: scaleX(-1);transform: scaleX(-1);'); 
    $('#recordSection').after(canvas);

    var video = document.createElement('video');   
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', ''); 
    video.setAttribute('muted', '');
    video.setAttribute('id', 'recordVid');  
    video.srcObject = this.myStream;  
    setTimeout(() => {
      video.muted = true; 
    }, 300);
    this.recordVideoEl = video;
    // video.setAttribute('style', 'transition: transform 0.8s;-webkit-transform: scaleX(-1);transform: scaleX(-1);');  

    var canvasStream = canvas.captureStream(100);
    var audioPlusCanvasStream = new MediaStream();

    canvasStream.getTracks().forEach(function (videoTrack) {
      audioPlusCanvasStream.addTrack(videoTrack);
    }); 
   /*  if(this.studentStream){
      this.studentStream.getTracks(this.studentStream, 'audio').forEach(function (audioTrack) {
        audioPlusCanvasStream.addTrack(audioTrack);
      });
    }else{
    } */
    this.myStream.getTracks(this.myStream, 'audio').forEach(function (audioTrack) {
      audioPlusCanvasStream.addTrack(audioTrack);
    });

    var recorder = RecordRTC(audioPlusCanvasStream, {
      type: 'video',
      videoBitsPerSecond: 51200000,
      mimeType: 'video/webm',
      timeSlice: 1000,
      bitsPerSecond: 128000,
      bufferSize: 16384,
      frameRate: 30,
      numberOfAudioChannels: 2, 
    });
    this.recorder = recorder; 
    recorder.startRecording(); 
    var tries = 0;
    (function looper() {
      if (!recorder) return; 
      tries += 100; 
      canvas.width = 980;
      canvas.height = 720; 
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.drawImage(logoImage, 20, 20, 90, 70);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.restore(); 
      setTimeout(looper, 100);
    })();  
  }

  pauseStudent(teacher, userdetails) {
    var conn = this.peer.connect(teacher.toString());
    var data = {
      handRaised: false,
      userdetails: userdetails
    }
    conn.on('open', function () {
      conn.send(data);
    });
  }

  
  
  
  raiseHand(teacher, userdetails) {
    var mainThis = this;
    this.peer.call(teacher.toString(), this.myStream); 
    var conn = this.peer.connect(teacher.toString());
    var data = {
      handRaised: true,
      userdetails: userdetails
    }
    conn.on('open', function () {
      conn.send(data);
    });
    this.teacherEl = document.querySelector('#my-video-el');
    $('#student_msg').html('wait for teacher approval'); 
    setTimeout(() => {
      var total_students = this.students.length; 
      $('#student_msg').html(''); 
    }, 6000);   
  }

  streamFromstudent(id,name, teacher,students) {  
    var mainThis = this;
    if(this.students.length > 0){
      mainThis.students.forEach(function(std){
        if(id != std.id){
          mainThis.peer.call(std.id.toString(), mainThis.myStream);
        }
      });
    } 
    //var r = this.peer.call(teacher.toString(), this.myStream);  
    /* var conn = this.peer.connect(teacher.toString());
    var data = {
      isPresenting: true,
      id: id,  
      name: name,  
    }
    conn.on('open', function () {
      conn.send(data);
    });  */
  }

  streamStopstudent(id, teacher,fullscreen) { 
    var mainThis = this;
    var conn = this.peer.connect(id.toString());
    var data = {
      isPresenting: true,
      stopRaisehand: true, 
    }
    conn.on('open', function () {
      conn.send(data);
    });
    $('#total_students').html('Student video stopped');
    setTimeout(() => {
      var total_students = this.students.length; 
      $('#total_students').html(''); 
    }, 6000);   
    $('.student-' + id).find('.addRaised').find('.studentRaised').remove();
    if(fullscreen){
      $('#my-video').css({'width':'100%','height':'100%','left': '0','object-fit': 'cover','float':'left','min-width': '50%','bottom':'0'});    
    }else{
      $('#my-video').css({'width':'100%','height':'100%','left': '0','object-fit': 'cover','float':'left','min-width': '50%'}); 
    }
    $('.student-' + id).find('.addRaised').find('.streamStopstudent').remove();
    $('#gofullScreen2').attr('id','gofullScreen');
    if(this.studentEl){
      this.studentEl.srcObject = null; 
    }
   /*  if(this.recordVideoEl){
      this.recordVideoEl.srcObject  = this.myStream;
    } */
    if(this.students.length > 0){
      mainThis.students.forEach(function(std){
        if(id != std.id){
          var conn = mainThis.peer.connect(std.id.toString());
          var data = {
            studentStopped: true,   
          }
          conn.on('open', function () {
            conn.send(data);
          });
        }
      });
    }
  }

  async stopRecording(lectureid,callback) {
    var mainThis = this;
    var recorder = this.recorder;
    var myFile = '';
    await recorder.stopRecording(function () {
      var blobData = recorder.getBlob();
      recorder = null;
      mainThis.myStream.stop();
      //blob = URL.createObjectURL(blobData);
      const myFile = new File(
        [blobData],
        "demo.mp4",
        { type: 'video/mp4' }
      );
      return callback(myFile);
    }); 
  }

  async studentPeer(userId: string) {
    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.waitstudent();
    });
  }


  async createPeer(userId: string) {
    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.wait();
    });
  }


  refreshStudents() {
    console.log(this.students)
  }

  call() {
    var mainThis = this;
    mainThis.isTeacherStreaming = true;
    this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
    if (this.students.length > 0) {
      this.students.forEach(function (student) { 
          mainThis.peer.call(student.id.toString(), mainThis.myStream); 
      }) 
      return true;
    } else {
      return false;
    }
  }

  streamToTeacher(stream, teacher, userdetails, userimage) {
    if(!teacher){
      $('#student_msg').html('Wait for teacher or try again'); 
      setTimeout(() => { 
        $('#student_msg').html(''); 
      }, 6000);
      return;
    }
    var mainThis = this;
    var conn = this.peer.connect(teacher.toString());
    if(conn){ 
      var data = {
          userdetails: userdetails,
          studentCall: true,
      }
      conn.on('open', function () {
        conn.send(data);
      });
      this.conn = conn;
      //$('#student_msg').html('You joined the class'); 
      
      $('#student_msg').html('Waiting for teacher'); 
      setTimeout(() => { 
        $('#student_msg').html(''); 
      }, 6000);
      $('.myonlinestatus').html('<a style="color: #17b117; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a>');
    }else{
      $('#student_msg').html('Wait for teacher or try again'); 
      setTimeout(() => { 
        $('#student_msg').html(''); 
      }, 6000);
    }

  }

  closeConnection(teacher,userdetails) {
    $('.myonlinestatus').html('<a style="color: #cf3b1e; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a>');
    this.partnerEl.srcObject = null; 
    if(teacher){ 
      var conn = this.peer.connect(teacher.toString());
      var data = {
        diconnect: true,
        student: this.userId,
        userdetails:userdetails 
      }
      conn.on('open', function () {
        conn.send(data);
      });
    }else{
      $('#student_msg').html('Re-setting class'); 
      setTimeout(() => { 
        $('#student_msg').html(''); 
      }, 6000);
      window.location.reload();
    }
    //this.myStream.stop();
  }

    flipStudentcam(teacher, userdetails, userimage){
      if(this.facingMode == 'user'){
        this.facingMode = 'environment';
      } else{
        this.facingMode = 'user';
      }
      navigator.getUserMedia({ audio: true, video: this.facingMode }, (stream) => { 
      }, (error) => {
        this.handleError(error);
      });
    }

  join(teacher, userdetails, userimage) {
    navigator.getUserMedia({ audio: true, video: this.facingMode }, (stream) => {
      this.streamToTeacher(stream, teacher, userdetails, userimage)
    }, (error) => {
      this.handleError(error);
    });
  }


  waitstudent() {
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => {
        this.studentEl.srcObject = stream;
      });
    });
  }

  wait() {
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => {
        this.partnerEl.srcObject = stream;
      });
    });
  }

  handleSuccess(stream: MediaStream) {

    this.myStream = stream;
    //this.myEl.src = URL.createObjectURL(this.myStream);
    this.myEl.srcObject = stream;
  }

  handleError(error: any) {
    const constraints = {
      video: true,
      audio: false
    };

    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
      // this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
      this.errorMsg(`The resolution px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
      this.errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    this.errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  errorMsg(msg: string, error?: any) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }
}
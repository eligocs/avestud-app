import Peer from 'peerjs';
import $ from 'jquery';
import { CallPage } from '../call/call.page';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ComponentFactoryResolver } from '@angular/core';
import * as RecordRTC from 'recordrtc';
interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}
export class WebrtcService {
  CallPage: CallPage;
  peer: Peer;
  studentStream: any;
  myStream: any;
  myEl: HTMLMediaElement;
  studentEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  teacherEl: HTMLMediaElement;
  onlineEl: any;
  options: any;
  audioMute: any;
  remote_student_video: any;
  students: any[] = [];
  type: any;
  userId: any;
  isTeacherStreaming: any;
  conn: any;
  recorder: any;
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
    var mainthis = this;
    var constraints = {
      audio: true
      , video: { facingMode: 'user' }
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        mainthis.myStream = stream;
        mainthis.myEl.srcObject = stream;
        console.log(stream)
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

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement, studentEl: HTMLMediaElement, type: string, students: any) {
     this.onlineEl = $('.onlineEl');
    this.audioMute = $('.audioMute');
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    this.studentEl = studentEl;
    this.userId = userId;
    this.type = type; 
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
            console.log(this.studentStream) 
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
          console.log(this.studentStream)
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


    /* if (data.studentCall == true) {
      console.log(this.peer)
     
    } */

    if (data.setupMembers == true) {
      var student = data.userdetails; 
      this.studentStream = this.myStream;  
      console.log(this.myStream)
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
        $('#student_msg').html(student.name.toUpperCase()+' stopped preseting'); 
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
        $('#partner-video').css({'width':'50%','height':'400px','right': '0','object-fit': 'cover','float':'left'}); 
        var video = document.createElement('video'); 
        video.setAttribute('autoplay', '');
        video.setAttribute('height', '400px');
        video.setAttribute('width', '50%');  
        video.setAttribute('playsinline', '');
        video.volume = 0;
        video.setAttribute('class', 'remote_student_video');
        video.setAttribute('id', 'remote_student_video'); 
        video.setAttribute('style', 'transition: transform 0.8s;-webkit-transform: scaleX(-1);transform: scaleX(-1);object-fit:cover');  
        $('#demoicon').append(video);
        this.remote_student_video = document.querySelector('#remote_student_video');  
        /* this.remote_student_video.srcObject = this.myStream */
        // this.peer.call(data.student.id.toString(), this.myStream); 
      return;
    }

    if (data.allowStudent == true) {
        $('#student_msg').html('Present your question'); 
        setTimeout(() => { 
          $('#student_msg').html(''); 
        }, 6000);    
        var student_id = data.student_id;
        var name = data.name; 
        this.students = data.allstudents;   
        this.streamFromstudent(student_id,name,this.userId,this.students);
        $('.student_has_question').html('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #470505, #d41616);color: white;border-radius: 4px;" class="btn_theme_live  streamStopstudent"  data-id="'+student_id+'"><i class="fa fa-desktop"></i> Stop</button>')
        /* $('.student_has_question').html('<button style="height: 36px;margin: 4px;background:linear-gradient(6deg, #365209, #72a52c);color: white;border-radius: 4px;" class="btn_theme_live  streamFromstudent"  data-id="' + student_id + '"><i class="fa fa-desktop"></i> Present Question</button>');  */
        // $('#partner-video').css({'width':'50%','height':'350px','right': '0'}); 
      return;
    }

    if (data.isOffline == true) {
        $('#student_msg').html('Teacher stopped presenting'); 
        $('.streaming_btn').attr('disabled',false).removeClass('streaming_btn'); 
        $('.leavebtn').attr('disabled',true); 
        $('.pausebtn').attr('disabled',true); 
        $('.onRaiseHand').attr('disabled',true);  
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

    if (data.ispaused == true) {
      if (data.pauseStatus == true) {
        this.onlineEl.html('<a style="color: #cf3b1e; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
        this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Video Paused</span>');
      } else {
        this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
        this.audioMute.html('');
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
            this.students.push(data.userdetails) 
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
    if (data.stopRaisehand == true) { 
      $('#total_students').html(data.userdetails.name+' has stop presenting');
      $('#my-video').css({'width':'100%','height':'400px',});  
      $('#my-video-el').css({'width':'100px','height':'100px','right': '0','bottom':'0'});
      this.studentEl.srcObject = null; 
    }
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
        html += '<div class="student-video-section"> <ion-row style="background: linear-gradient(130deg,#385169 -12%, #385169 12%, #385169 18%,#1f1e1e 74%);border: 1px solid #848484;border-radius: 4px;" class="background_students student-' + std.id + '"><ion-col size="2"><div class=""> <img  class="student_image" style="min-height: 46px;max-width: 100%;border-radius: 34px;" src=' + image + ' alt="student_img.jpg"></div></ion-col><ion-col size="10"><div class="student-details addRaised"><h4>' + std.name + ' <span class="myonlinestatus"></span> <a style="color: #17b117; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a></h4></div></ion-col></ion-row></div>';
        // html += '<ion-row class="background_students student-' + std.id + '"><ion-col size="3"> <div class=""> <img class="student_image" src=' + image + ' alt="student_img.jpg"></div></ion-col><ion-col size="9"><div class="student-details addRaised"><h4>' + std.name + ' <a style="color: #17b117; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a></h4></div></ion-col></ion-row>';
        if (itemsProcessed === mainThis.students.length) {
          $('#studentdiv').html(html);
        }
        setTimeout(() => { 
          if (std.isPresenting == 1) { 
            setTimeout(() => {
              $('#total_students').html(data.name+' is presenting');
            }, 1000);
            $('.student-' + data.id).find('.addRaised').append('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live studentRaised"  data-id="' + data.id + '"><i class="fa fa-desktop"></i> Student is presenting ...</button>'); 
          } else {
            if (std.handRaised == 1) {
              $('.student-' + std.id).find('.addRaised').append('<button style="height: 36px;margin: 4px;background: linear-gradient(6deg, #2b3642, #667a90);color: white;border-radius: 4px;" class="btn_theme_live studentRaised" data-name="'+std.name+'"  data-id="' + std.id + '">I have a question <i class="fa fa-eye"></i></button>'); 
            } else {
              $('.student-' + std.id).find('.addRaised').find('.studentRaised').remove();
            }
          }
        }, 500);
        
      })
      
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

  allowStudent(id,name, teacher) {
    var mainThis = this;
    $('#my-video').css({'width':'50%','height':'400px','left': '0','object-fit': 'cover','float':'left'});  
    $('#my-video-el').css({'width':'50%','height':'400px','right': '0'});  
   
    if(this.studentStream){ 
      this.studentEl.srcObject = this.studentStream;
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
        }
        con.on('open', function () {
          con.send(data);
        });
        //mainThis.peer.call(student.id.toString(), mainThis.myStream); 
      } 
    }) 
  }

  startRecord() {
    var mainThis = this;

    //var videoPreview = <HTMLMediaElement> document.getElementById('video-preview');
    var logoImage = <CanvasImageSource>document.getElementById('logo-image');
    var waitImage = <CanvasImageSource>document.getElementById('logo-image');


    var canvas = <CanvasElement>document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.setAttribute('style', 'position: absolute; z-index: -1;display:none;');
    $('#demoicon').after(canvas);

    var video = document.createElement('video');
    video.setAttribute('style', 'display:none;');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('class', 'mericlass');
    video.srcObject = this.myStream;

    var canvasStream = canvas.captureStream(100);
    var audioPlusCanvasStream = new MediaStream();

    canvasStream.getTracks().forEach(function (videoTrack) {
      audioPlusCanvasStream.addTrack(videoTrack);
    });
    this.myStream.getTracks(this.myStream, 'audio').forEach(function (audioTrack) {
      audioPlusCanvasStream.addTrack(audioTrack);
    });

    var recorder = RecordRTC(audioPlusCanvasStream, {
      type: 'video'
    });
    this.recorder = recorder;




    recorder.startRecording();
    // videoPreview.srcObject = canvasStream;

    var tries = 0;
    (function looper() {
      if (!recorder) return; // ignore/skip on stop-recording 

      tries += 100;

      canvas.width = 400;
      canvas.height = 400;

      // show hello.png for one second
      if (tries < 5000 || tries > 6000) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // context.drawImage(logoImage, parseInt(canvas.width / 2) - parseInt(logoImage.width / 2), canvas.height - logoImage.height - 10);
        // context.drawImage(logoImage, parseInt(canvas.width / 2) - parseInt(32 / 2), canvas.height - 32 - 10, 32, 32);
        context.drawImage(logoImage, 10, 10, 100, 60);
      }
      else {
        context.drawImage(waitImage, 10, 10, 100, 60);
      }

      // repeat (looper)
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
    // if(this.students.length > 0){
    //   mainThis.students.forEach(function(std){
    //     if(userdetails.id != std.id){
    //       var conn = this.peer.connect(teacher.toString());
    //       var data = {
    //         setupMembers: true,
    //         userdetails: userdetails
    //       }
    //       conn.on('open', function () {
    //         conn.send(data);
    //       });
    //       //mainThis.peer.call(std.id.toString(), mainThis.myStream);
    //     }
    //   });
    // }
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
    console.log('yes')
    // console.log(userdetails)
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

  streamStopstudent(userdetails, teacher) {
    var mainThis = this;
    var conn = this.peer.connect(teacher.toString());
    var data = {
      isPresenting: true,
      stopRaisehand: true,
      userdetails: userdetails
    }
    conn.on('open', function () {
      conn.send(data);
    });
    if(this.students.length > 0){
      mainThis.students.forEach(function(std){
        if(userdetails.id != std.id){
          var conn = mainThis.peer.connect(std.id.toString());
          var data = {
            studentStopped: true,
            userdetails: userdetails,  
          }
          conn.on('open', function () {
            conn.send(data);
          });
        }
      });
    }
  }

  stopRecording() {
    var mainThis = this;
    var recorder = this.recorder;
    recorder.stopRecording(function () {
      var blob = recorder.getBlob();
      recorder = null;
      mainThis.myStream.stop();
      window.location.href = URL.createObjectURL(blob);
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


  join(teacher, userdetails, userimage) {
    navigator.getUserMedia({ audio: true, video: { facingMode: 'user' } }, (stream) => {
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
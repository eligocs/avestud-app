import Peer from 'peerjs'; 
import $ from 'jquery';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable'; 
import { ComponentFactoryResolver } from '@angular/core';
import * as RecordRTC from 'recordrtc';
interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}
export class WebrtcService {
  peer: Peer;
  myStream: any;
  myEl: HTMLMediaElement;
  studentEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  onlineEl: any;
  options:any; 
  audioMute:any; 
  students:any[] = [];
  type:any;
  userId:any;
  conn:any; 
  recorder:any; 
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
      audio: true, video: {facingMode: 'user'}
    };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      mainthis.myStream = stream; 
      mainthis.myEl.srcObject = stream; 
    })
    .catch(function(err) {
      
    }); 
  }

  stop(){
    var stream = this.myStream;  
    if(stream){  
      stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled); 
    } 
  }

  mutevideo(status){ 
      var mainThis = this;
      this.students.forEach(function(std){ 
        var conn = mainThis.peer.connect(std.id.toString());  
        var data = {
          ismuted:true, 
          status:status, 
        } 
        conn.on('open', function(){
          conn.send(data);
        }); 
      }); 
    if(status == true){
      this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Audio Muted</span>'); 
    }else{
      this.audioMute.html(''); 
    }
    var stream = this.myStream;
    if(stream){
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled); 
    }
  }

  listAll(){
    this.peer.listAllPeers(list => console.log(list)); 
  }

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement,studentEl:HTMLMediaElement,type:string,students:any) {   
    this.onlineEl = $('.onlineEl');
    this.audioMute = $('.audioMute');
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    this.studentEl = studentEl;
    this.userId = userId;
    this.type = type;   
    if(myEl){
      try {
        this.getMedia();
      } catch (e) {
        this.handleError(e);
      }
    }    
    this.peer = new Peer(userId); 
   
  this.peer.on('open', () => { 
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => {   
          this.onlineEl.html('<a style="color: #00bc35; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
          if(this.partnerEl){
            this.partnerEl.srcObject = stream;
          } 
          if(this.studentEl){
            this.studentEl.srcObject = stream; 
          }  
        });
      });
    }); 
    var mainThis = this;
    this.peer.on('connection', function(conn) {
      conn.on('data', function(data){    
        mainThis.appendStudent(data);  
      }); 
    });   
  }
  showOnline(){
    this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
  }

  pauseVideo(status,teacher){
    var mainThis = this;
    this.students.forEach(function(std){ 
      var conn = mainThis.peer.connect(std.id.toString());  
      var data = {
        ispaused:true,
        pauseStatus:status, 
      } 
      conn.on('open', function(){
        conn.send(data);
      }); 
    }); 
    if(status == true){
      this.onlineEl.html('<a style="color: #cf3b1e; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
      this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Video Paused</span>'); 
    }else{
      this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>');
      this.audioMute.html(''); 
    }
  }

  destroyPeer(){
    this.peer.destroy() 
    this.peer.disconnect()
  }
  appendStudent(data){ 
    console.log(data)
    if(data.ismuted == true){
      if(data.status == true){
        this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Audio Muted</span>'); 
      }else{
        this.audioMute.html(''); 
      }
      return;
    }   

    if(data.ispaused == true){
      if(data.pauseStatus == true){
        this.onlineEl.html('<a style="color: #cf3b1e; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>'); 
        this.audioMute.html('<span style="background: #9f0202;border-radius: 3px;padding: 3px;"><i class="fa fa-microphone"></i> Video Paused</span>'); 
      }else{
        this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>'); 
        this.audioMute.html(''); 
      }
      return;
    }


    if(data.diconnect == true){
      var student = data.student;
      var index = this.students.findIndex(function(o){
        return o.id === student;
      })
      if (index !== -1) {
        this.students.splice(index, 1);
      }; 
    } else{
      this.students.push(data.userdetails) 
    } 


    $('#studentdiv').html('')
    var mainThis = this;
    var html = ""; 
    var itemsProcessed = 0; 
    if(this.students.length > 0){

      this.students.forEach(function(std){
        itemsProcessed++;
        var image = std.avatar ? std.avatar : ""; 
        html += '<ion-row class="student-'+std.id+'"><ion-col size="3"> <div class="shedule_card"> <img style="min-height:100px;" src='+image+' alt="student_img.jpg"></div></ion-col><ion-col size="9"><div class="student-details"><h4>'+std.name+' <a style="color: #17b117; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a></h4><div class="btns-m " ><button style="height: 36px;margin: 4px;" class="btn_theme_live"  ><i class="fa fa-microphone"></i> Audio</button><button style="height: 36px;margin: 4px;" class="btn_theme_live"  ><i class="fa fa-play"></i> Video</button></div></div></ion-col></ion-row>'; 
        if(itemsProcessed === mainThis.students.length) {  
          $('#studentdiv').html(html); 
        }
      })
    }else{
      $('#studentdiv').html('<ion-row "><ion-col size="12"><div class="shedule_card ion-text-center">No students Yet !</div></ion-col></ion-row>');
    }
  }

  startRecord(){
    var videoPreview = document.getElementById('video-preview');
    var logoImage = document.getElementById('logo-image');
    var waitImage = document.getElementById('logo-image');
    var canvas = <CanvasElement> document.createElement('canvas');
    var context = canvas.getContext('2d');  
    // canvas.style = 'position: absolute; top: 0; left: 0; opacity: 0; margin-top: -9999999999; margin-left: -9999999999; top: -9999999999; left: -9999999999; z-index: -1;';
    document.body.appendChild(canvas);
    var canvasStream = canvas.captureStream(15);
    var audioPlusCanvasStream = new MediaStream();
    this.myStream.getAudioTracks().forEach(function(track) {
      // merge microphone into canvas stream
      audioPlusCanvasStream.addTrack(track);
    });
    this.myStream.getVideoTracks().forEach(function(track) {
      // merge microphone into canvas stream
      audioPlusCanvasStream.addTrack(track);
    }); 

    var recorder = RecordRTC(audioPlusCanvasStream, {
        type: 'video'
    });
    this.recorder = recorder;
    recorder.startRecording();
    recorder.setRecordingDuration(10 * 1000).onRecordingStopped(function() {
      var blob = recorder.getBlob();
      recorder = null;
      this.myStream.stop();

      alert(blob)
    });
      //videoPreview.srcObject = canvasStream;

      var tries = 0;
    (function looper() {
        if(!recorder) return; // ignore/skip on stop-recording

        tries += 100;

        canvas.width = 320;
        canvas.height = 240;

        // show hello.png for one second
        if(tries < 5000 || tries > 6000) {
            context.drawImage(this.myEl, 0, 0, canvas.width, canvas.height);

            // context.drawImage(logoImage, parseInt(canvas.width / 2) - parseInt(logoImage.width / 2), canvas.height - logoImage.height - 10);
            // context.drawImage(logoImage, parseInt(canvas.width / 2) - parseInt(32 / 2), canvas.height - 32 - 10, 32, 32);
            //context.drawImage(logoImage, 10, 10, 32, 32);
        }
        else {
            //context.drawImage(waitImage, 0, 0, canvas.width, canvas.height);
        }

        // repeat (looper)
        setTimeout(looper, 100);
    })();

  

  }


  raiseHand(){

  }

  async stopRecording(){
    await this.recorder.stopRecording();
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


  refreshStudents(){
    console.log(this.students)
  }

  call() {  
    var mainThis = this;     
    if(this.students.length > 0){ 
      this.onlineEl.html('<a style="color: #17b117; margin-left:5px;float: right;" href="#"><i class="fa fa-circle"></i></a>'); 
      this.students.forEach(function(student){   
        var call = mainThis.peer.call(student.id.toString(), mainThis.myStream);   
      })  
      /* call.on('stream', (stream) => {
        mainThis.partnerEl.srcObject = stream; 
        document.getElementById('partner-video153')[0].srcObject = stream;
        document.getElementById('partner-video165')[0].srcObject = stream; 
      }); */ 
      return true;
    }else{
      return false;
    }
  }

  streamToTeacher(stream,teacher,userdetails,userimage){  
    var mainThis = this;
    var conn = this.peer.connect(teacher);  
    var data = {
      userdetails:userdetails
    }
    conn.on('open', function(){
      conn.send(data);
    });  
    this.conn = conn; 
    $('.myonlinestatus').html('<a style="color: #17b117; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a>');
    
  }

  closeConnection(teacher){ 
    $('.myonlinestatus').html('<a style="color: #cf3b1e; margin-left:5px;" href="#"><i class="fa fa-circle"></i></a>');
    var conn = this.peer.connect(teacher);  
    var data = {
      diconnect:true,
      student:this.userId,
    }
    conn.on('open', function(){
      conn.send(data);
    });   
  }


  hand(teacher,userdetails,userimage){  
    navigator.getUserMedia({ audio: true, video: {facingMode: 'user'} }, (stream) => { 
      this.streamToTeacher(stream,teacher,userdetails,userimage)  
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
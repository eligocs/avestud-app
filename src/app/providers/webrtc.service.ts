import Peer from 'peerjs'; 
import $ from 'jquery';
export class WebrtcService {
  peer: Peer;
  myStream: any;
  myEl: HTMLMediaElement;
  studentEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  options:any; 
  students:any[] = [];
  type:any;
  userId:any;
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
    navigator.getUserMedia({ audio: true, video: {facingMode: 'user'} }, (stream) => { 
      this.handleSuccess(stream);  
    }, (error) => {
      this.handleError(error);
    }); 
  }
  stop(){
    var stream = this.myStream;
    if(stream){
      // stream.getTracks().forEach(function(track) { track.stop(); }) ;
      stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
    } 
  }
  mutevideo(){
    var stream = this.myStream;
    if(stream){
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled); 
    }
  }

  listAll(){
    this.peer.listAllPeers(list => console.log(list)); 
  }

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement,studentEl:HTMLMediaElement,type:string,students:any) { 
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    this.studentEl = studentEl;
    this.type = type;  
    
    if(myEl){
      try {
        this.getMedia();
      } catch (e) {
        this.handleError(e);
      }
    }    
    this.peer = new Peer(userId);  
    console.log(this.peer)
    console.log(userId)
    this.peer.on('open', () => {
      this.peer.on('call', (call) => {
        call.answer(this.myStream);
        call.on('stream', (stream) => {  
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

  appendStudent(data){
    this.students.push(data.userdetails.id) 
    var image = data.userdetails.avatar ? data.userdetails.avatar : ""; 
    $('#studentdiv').append('<ion-row><ion-col size="3"> <div class="shedule_card"> <img style="min-height:100px;" src='+image+' alt="student_img.jpg"></div></ion-col><ion-col size="9"><div class="student-details"><h4>'+data.userdetails.name+'</h4><div class="btns-m " ><button style="height: 36px;margin: 4px;" class="btn_theme_live"  ><i class="fa fa-microphone"></i> Audio</button><button style="height: 36px;margin: 4px;" class="btn_theme_live"  ><i class="fa fa-play"></i> Video</button><button style="height: 36px;margin: 4px;" class="btn_theme_live"  ><i class="fa fa-thumb"></i> Raise Hand</button></div></div></ion-col></ion-row>');
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

  call(students: any) { 
    var mainThis = this;  
    
   /*  this.peer.on('open', () => {
      this.peer.on('call', (call) => {
        call.answer(this.myStream);
        call.on('stream', (stream) => { 
          this.partnerEl.srcObject = stream;
        });
      });
    }); */
    students.forEach(function(student){ 
      
      var call = mainThis.peer.call(student, mainThis.myStream);   
      /* call.on('stream', (stream) => {
          mainThis.partnerEl.srcObject = stream; 
        document.getElementById('partner-video153')[0].srcObject = stream;
        document.getElementById('partner-video165')[0].srcObject = stream; 
      }); */ 
    })  
   
  }

  streamToTeacher(stream,teacher,userdetails,userimage){ 
    var data = {
      userdetails:userdetails,
      userimage:userimage
    }
    console.log(this.peer)
    var conn = this.peer.connect(teacher);
    conn.on('open', function(){
      conn.send(data);
    });
    var call = this.peer.call(teacher, stream);      
    call.on('stream', (stream) => {  
      if(this.studentEl){
        this.studentEl.srcObject = stream;
      }
    });
    
  }


  hand(teacher,userdetails,userimage){  
    navigator.getUserMedia({ audio: true, video: {facingMode: 'user'} }, (stream) => { 
      this.streamToTeacher(stream,teacher,userdetails,userimage)  
    }, (error) => {
      this.handleError(error);
    }); 
  }
 /*  call(partnerId: string) {
    const call = this.peer.call(partnerId, this.myStream);
    console.log(partnerId)
    call.on('stream', (stream) => {
      this.partnerEl.srcObject = stream;
    });
  } */

  waitstudent() {  
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => { 
        this.studentEl.srcObject = stream;
      });
    });
  }

  wait() { 
    console.log(this.partnerEl)
    console.log('this.partnerEl')
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
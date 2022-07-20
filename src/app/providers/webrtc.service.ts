import Peer from 'peerjs'; 
export class WebrtcService {
  peer: Peer;
  myStream: any;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  options:any;
  stun = 'stun.l.google.com:19302';
 /*  mediaConnection: Peer.MediaConnection;
  options: Peer.PeerJSOption; */ 
  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun,
  };

  constructor() {

    this.options = {  // not used, by default it'll use peerjs server
      key: 'cd1ft79ro8g833di',
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

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement) { 
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    if(myEl){
      try {
        this.getMedia();
      } catch (e) {
        this.handleError(e);
      }
    }
    await this.createPeer(userId);
  }

  async createPeer(userId: string) {
    this.peer = new Peer(userId); 
    console.log(this.peer)
    this.peer.on('open', () => {
      this.wait();
    });
  }

  call(students: any) {
    var mainThis = this; 
    students.forEach(function(student){
      var call = mainThis.peer.call(student, mainThis.myStream);  
      /* call.on('stream', (stream) => {
          mainThis.partnerEl.srcObject = stream; 
        document.getElementById('partner-video153')[0].srcObject = stream;
        document.getElementById('partner-video165')[0].srcObject = stream; 
      }); */ 
    }) 
  }
  hand(user){
    navigator.getUserMedia({ audio: true, video: {facingMode: 'user'} }, (stream) => {  
      var call = this.peer.call(user, stream);   
      console.log(this.myEl)
      call.on('stream', (stream) => { 
        this.myEl.srcObject = stream;
      });
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
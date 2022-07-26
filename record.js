
var videoPreview = document.getElementById('video-preview');
var logoImage = document.getElementById('logo-image');
var waitImage = document.getElementById('wait-image');

navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function(camera) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.style = 'position: absolute; top: 0; left: 0; opacity: 0; margin-top: -9999999999; margin-left: -9999999999; top: -9999999999; left: -9999999999; z-index: -1;';
    document.body.appendChild(canvas);

    var video = document.createElement('video');
    video.autoplay = true;
    video.playsinline = true;
    video.srcObject = camera;

    var canvasStream = canvas.captureStream(15);

    var audioPlusCanvasStream = new MediaStream();

    // "getTracks" is RecordRTC's built-in function
    getTracks(canvasStream, 'video').forEach(function(videoTrack) {
        audioPlusCanvasStream.addTrack(videoTrack);
    });

    // "getTracks" is RecordRTC's built-in function
    getTracks(camera, 'audio').forEach(function(audioTrack) {
        audioPlusCanvasStream.addTrack(audioTrack);
    });

    var recorder = RecordRTC(audioPlusCanvasStream, {
        type: 'video'
    });

    recorder.setRecordingDuration(10 * 1000).onRecordingStopped(function() {
        var blob = recorder.getBlob();
        recorder = null;
        camera.stop();

        videoPreview.srcObject = null;
        videoPreview.src = URL.createObjectURL(blob);
    });

    recorder.startRecording();

    videoPreview.srcObject = canvasStream;

    var tries = 0;
    (function looper() {
        if(!recorder) return; // ignore/skip on stop-recording

        tries += 100;

        canvas.width = 320;
        canvas.height = 240;

        // show hello.png for one second
        if(tries < 5000 || tries > 6000) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // context.drawImage(logoImage, parseInt(canvas.width / 2) - parseInt(logoImage.width / 2), canvas.height - logoImage.height - 10);
            // context.drawImage(logoImage, parseInt(canvas.width / 2) - parseInt(32 / 2), canvas.height - 32 - 10, 32, 32);
            context.drawImage(logoImage, 10, 10, 32, 32);
        }
        else {
            context.drawImage(waitImage, 0, 0, canvas.width, canvas.height);
        }

        // repeat (looper)
        setTimeout(looper, 100);
    })();
}).catch(function(error) {
    alert('Unable to capture camera. Please check console logs.');
    console.error(error);
});

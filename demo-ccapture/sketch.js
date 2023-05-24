
const WAVY = ( s ) => 
{
  let theShader;
  let canvas;
  let f;
  let textGraphic;

  let zoom = 1;
  let offset;
  
  let displayWidth = 500;
  let displayHeight = 500;

  s.preload = () => 
  {
    theShader = s.loadShader('vert.glsl', 'frag.glsl');
    f = s.loadFont("Nunito-SemiBold.ttf");
  }

  s.setup = () => 
  {
    s.frameRate(60);
    //s.pixelDensity(2);
    canvas = s.createCanvas(displayWidth, displayHeight, s.WEBGL);
    s.background(0);
    offset = s.createVector(0, 0);
    
    textGraphic = s.createGraphics(displayWidth, displayHeight, s.WEBGL);
    textGraphic.pixelDensity(2);
    textGraphic.background(0);
    textGraphic.textFont(f);
    textGraphic.textSize(100);
    textGraphic.textAlign(s.CENTER, s.CENTER);
    textGraphic.fill("#ffffff");
    textGraphic.text("TRAP", 100, -120);
    textGraphic.text("BANGER", 100, 50);
    
    zoom = 0.45;
    offset.x = 50;

    //console.log(canvas.drawingContext.getContextAttributes());
  }

  s.draw = () => 
  {
    var y = (s.mouseY-(displayHeight/2)) / s.min(1, s.windowWidth / s.windowHeight) + (displayHeight/2);
    var py = (s.pmouseY-(displayHeight/2)) / s.min(1, s.windowWidth / s.windowHeight) + (displayHeight/2);
    
    theShader.setUniform("u_resolution", [s.width * 2, s.height * 2]);
    theShader.setUniform("u_time", s.millis() / 1000.0);
    theShader.setUniform("u_offset", [-offset.x * 2, offset.y * 2]);
    theShader.setUniform("u_zoom", 1.0 / zoom);
    theShader.setUniform("u_mouse", [s.mouseX * 2, (s.height-y) * 2]);
    theShader.setUniform("u_text", textGraphic);

    s.noStroke();
    s.shader(theShader);
    s.rect(s.width * -0.5, s.height * -0.5, s.width, s.height);
  }

  s.keyPressed = () => 
  {
    if (s.key === "c") {
      const capture = P5Capture.getInstance();
      if (capture.state === "idle") {
        capture.start();
      } else {
        capture.stop();
      }
    }
  }
}

 // Create a new ffmpeg.wasm instance
 var ffmpeg = new FFmpeg();

 // Create a new video encoder
 var encoder = ffmpeg.createEncoder("libx264");

 // Set the video encoder options
 encoder.set("fps", 30);
 encoder.set("video_size", "500x500");

 // Create a variable to store the recording state
 var recording = false;

 // Start recording the video when the startRecordingButton is clicked
 document.getElementById("startRecordingButton").addEventListener("click", function() {
   recording = true;
   encoder.startRecording("output.mp4");
 });

 // Stop recording the video when the stopRecordingButton is clicked
 document.getElementById("stopRecordingButton").addEventListener("click", function() {
   recording = false;
   encoder.stopRecording();
 });

 // Render the video to the canvas
 ffmpeg.on("frame", function(frame) {
   var ctx = canvas.getContext("2d");
   ctx.drawImage(frame, 0, 0);
 });

let thep5 = new p5(WAVY, 'wavySketch');
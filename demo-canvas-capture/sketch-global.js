let theShader
//let canvas
let f
let textGraphic

let zoom = 1
let offset
let pd = 1 // pixelDensity

// ENCODER
let cwidth = 1080
let cheight = 1080
let button

let encoder

const frate = 30 // frame rate
const numFrames = 100 // num of frames to record
let recording = false
let recordedFrames = 0

let count = 0

function preload() {
  theShader = loadShader('vert.glsl', 'frag.glsl')
	f = loadFont("Nunito-SemiBold.ttf")
}

function setup() {
  frameRate(frate)
  pixelDensity(1)
	createCanvas(cwidth, cheight, WEBGL)
  //canvas.parent("wavy");
	background(0)
  textFont(f)
	offset = createVector(0, 0)
	
	textGraphic = createGraphics(cwidth, cheight, WEBGL)
	textGraphic.pixelDensity(2)
	textGraphic.background(0)
	textGraphic.textFont(f)
	textGraphic.textSize(100)
	textGraphic.textAlign(CENTER, CENTER)
	textGraphic.fill("#ffffff")
	textGraphic.text("TRAP", 100, -120)
	textGraphic.text("BANGER", 100, 50)
	
	zoom = 0.45
	offset.x = 50

  // INIT CAPTURE
  //canvas = document.getElementById('my-canvas');
  CanvasCapture.init(canvas, {
    showRecDot: true,
    showAlerts: true,
    showDialogs: true,
    verbose: false,
    ffmpegCorePath: '../ffmpeg/ffmpeg-core.js',
  });

  // Bind key presses to begin/end recordings.
  const MP4_OPTIONS = {
    name: 'demo-canvas-capture-mp4',
    format: CanvasCapture.MP4,
    quality: 1,
    fps: 60,
    onExportProgress: (progress) => console.log(`MP4 export progress: ${progress}.`),
    onExportFinish: () => console.log(`Finished MP4 export.`),
  };
  CanvasCapture.bindKeyToVideoRecord('v', MP4_OPTIONS);
}

function draw() {
  //background(220)
  textSize(128)
  textAlign(CENTER, CENTER)
  text(count, width / 2, height / 2)
  count++

  var y = (mouseY-(cheight/2)) / min(1, windowWidth / windowHeight) + (cheight/2)
	var py = (pmouseY-(cheight/2)) / min(1, windowWidth / windowHeight) + (cheight/2)
	
	theShader.setUniform("u_resolution", [width * pd, height * pd])
	theShader.setUniform("u_time", millis() / 1000.0)
	theShader.setUniform("u_offset", [-offset.x * pd, offset.y * pd])
	theShader.setUniform("u_zoom", 1.0 / zoom)
	theShader.setUniform("u_mouse", [mouseX * pd, (height-y) * pd])
	theShader.setUniform("u_text", textGraphic)

	noStroke()
	shader(theShader)
	rect(width * -0.5, height * -0.5, width, height)

  // CAPTURE
  if (CanvasCapture.isRecording()) CanvasCapture.recordFrame();    
}


const { CanvasCapture } = CanvasCaptureLib;

const startRecordMP4 = document.getElementById('startMP4');
let mp4Capture;
startRecordMP4.addEventListener('click', (e) => {
  e.preventDefault();
  mp4Capture = CanvasCapture.beginVideoRecord(MP4_OPTIONS);
  startRecordMP4.style.display = mp4Capture ? 'none' : 'inline';
  stopRecordMP4.style.display = mp4Capture ? 'inline' : 'none';
});
const stopRecordMP4 = document.getElementById('stopMP4');
stopRecordMP4.addEventListener('click', (e) => {
  e.preventDefault();
  CanvasCapture.stopRecord(mp4Capture);
  mp4Capture = undefined;
  stopRecordMP4.style.display = 'none';
  startRecordMP4.style.display = 'inline';
});
stopRecordMP4.style.display = 'none';

document.getElementById('MP4-support').innerHTML = `(supported by this browser: ${CanvasCapture.browserSupportsMP4()})`;
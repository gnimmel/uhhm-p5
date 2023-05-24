const sketch = ( p ) => 
{
  let theShader;
  let canvas;
  let f;
  let textGraphic;

  let zoom = 1;
  let offset;
  let intPixDensity = 1;
  let displayWidth = 500;
  let displayHeight = 500;

  const { CanvasCapture } = CanvasCaptureLib;

  p.preload = () => 
  {
    theShader = p.loadShader('vert.glsl', 'frag.glsl');
    f = p.loadFont("Nunito-SemiBold.ttf");
  }

  p.setup = () => 
  {
    p.frameRate(60);
    p.pixelDensity(intPixDensity);
    p.createCanvas(displayWidth, displayHeight, p.WEBGL);
    p.background(0);
    offset = p.createVector(0, 0);
    
    textGraphic = p.createGraphics(displayWidth, displayHeight, p.WEBGL);
    textGraphic.pixelDensity(intPixDensity);
    textGraphic.background(0);
    textGraphic.textFont(f);
    textGraphic.textSize(Math.round(displayWidth*0.14));
    textGraphic.textAlign(p.CENTER, p.CENTER);
    textGraphic.fill("#ffffff");
    textGraphic.text("TRAP", Math.round(displayWidth*0.1), -(Math.round(displayHeight*0.12)));
    textGraphic.text("BANGER", Math.round(displayWidth*0.1), Math.round(displayHeight*0.05));
    
    zoom = 0.45;
    offset.x = 50;

    CanvasCapture.init(p.canvas, {
      showRecDot: true,
      showAlerts: true,
      showDialogs: true,
      verbose: true,
      ffmpegCorePath: '../ffmpeg/ffmpeg-core.js',
    });

    // Bind key presses to begin/end recordingp.
    const MP4_OPTIONS = {
      name: 'demo-canvas-capture-mp4',
      format: CanvasCapture.MP4,
      quality: 1,
      fps: 30,
      onExportProgress: (progress) => console.log(`MP4 export progress: ${progress}.`),
      onExportFinish: () => console.log(`Finished MP4 export.`),
    };
    CanvasCapture.bindKeyToVideoRecord('v', MP4_OPTIONS);
    const WEBM_OPTIONS = {
      name: 'demo-canvas-capture-webm',
      format: CanvasCapture.WEBM,
      quality: 1,
      fps: 30,
      onExportProgress: (progress) => console.log(`WEBM export progress: ${progress}.`),
      onExportFinish: () => console.log(`Finished WEBM export.`),
    };
    CanvasCapture.bindKeyToVideoRecord('w', WEBM_OPTIONS);

    const PNG_OPTIONS = {
      name: 'demo-canvas-capture-png',
      dpi: 72,
      onExportProgress: (progress) => console.log(`PNG frames export progress: ${progress}.`),
      onExportFinish: () => console.log(`Finished PNG frames zip.`),
    };
    CanvasCapture.bindKeyToPNGFramesRecord('o', PNG_OPTIONS);
    const JPEG_OPTIONS = {
      name: 'demo-canvas-capture-jpg',
      quality: 1,
      dpi: 72,
      onExportProgress: (progress) => console.log(`JPEG frames export progress: ${progress}.`),
      onExportFinish: () => console.log(`Finished JPEG frames zip.`),
    };
    CanvasCapture.bindKeyToJPEGFramesRecord('h', JPEG_OPTIONS);

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

    const startRecordWEBM = document.getElementById('startWEBM');
    let webmCapture;
    startRecordWEBM.addEventListener('click', (e) => {
      e.preventDefault();
      webmCapture = CanvasCapture.beginVideoRecord(WEBM_OPTIONS);
      startRecordWEBM.style.display = webmCapture ? 'none' : 'inline';
      stopRecordWEBM.style.display = webmCapture ? 'inline' : 'none';
    });
    const stopRecordWEBM = document.getElementById('stopWEBM');
    stopRecordWEBM.addEventListener('click', (e) => {
      e.preventDefault();
      CanvasCapture.stopRecord(webmCapture);
      webmCapture = undefined;
      stopRecordWEBM.style.display = 'none';
      startRecordWEBM.style.display = 'inline';
    });
    stopRecordWEBM.style.display = 'none';

    const startRecordPNGFrames = document.getElementById('startPNG');
    let pngFramesCapture;
    startRecordPNGFrames.addEventListener('click', (e) => {
      e.preventDefault();
      pngFramesCapture = CanvasCapture.beginPNGFramesRecord(PNG_OPTIONS);
      startRecordPNGFrames.style.display = pngFramesCapture ? 'none' : 'inline';
      stopRecordPNGFrames.style.display = pngFramesCapture ? 'inline' : 'none';
    });
    const stopRecordPNGFrames = document.getElementById('stopPNG');
    stopRecordPNGFrames.addEventListener('click', (e) => {
      e.preventDefault();
      CanvasCapture.stopRecord(pngFramesCapture);
      pngFramesCapture = undefined;
      stopRecordPNGFrames.style.display = 'none';
      startRecordPNGFrames.style.display = 'inline';
    });
    stopRecordPNGFrames.style.display = 'none';
    
    const startRecordJPGFrames = document.getElementById('startJPG');
    let jpgFramesCapture;
    startRecordJPGFrames.addEventListener('click', (e) => {
      e.preventDefault();
      jpgFramesCapture = CanvasCapture.beginJPEGFramesRecord(JPEG_OPTIONS);
      startRecordJPGFrames.style.display = jpgFramesCapture ? 'none' : 'inline';
      stopRecordJPGFrames.style.display = jpgFramesCapture ? 'inline' : 'none';
    });
    const stopRecordJPGFrames = document.getElementById('stopJPG');
    stopRecordJPGFrames.addEventListener('click', (e) => {
      e.preventDefault();
      CanvasCapture.stopRecord(jpgFramesCapture);
      pngFramesCapture = undefined;
      stopRecordJPGFrames.style.display = 'none';
      startRecordJPGFrames.style.display = 'inline';
    });
    stopRecordJPGFrames.style.display = 'none';

    document.getElementById('MP4-support').innerHTML = `(browser supported: ${CanvasCapture.browserSupportsMP4()})`;
    document.getElementById('WEBM-support').innerHTML = `(browser supported: ${CanvasCapture.browserSupportsWEBM()})`;
  }

  p.draw = () => 
  {
    var y = (p.mouseY-(displayHeight/intPixDensity)) / p.min(1, p.windowWidth / p.windowHeight) + (displayHeight/intPixDensity);
    var py = (p.pmouseY-(displayHeight/intPixDensity)) / p.min(1, p.windowWidth / p.windowHeight) + (displayHeight/intPixDensity);
    
    theShader.setUniform("u_resolution", [p.width * intPixDensity, p.height * intPixDensity]);
    theShader.setUniform("u_time", p.millis() / 500.0);
    theShader.setUniform("u_offset", [-offset.x * intPixDensity, offset.y * intPixDensity]);
    theShader.setUniform("u_zoom", 1.0 / zoom);
    theShader.setUniform("u_mouse", [p.mouseX * intPixDensity, (p.height-y) * intPixDensity]);
    theShader.setUniform("u_text", textGraphic);

    //p.noStroke();
    p.shader(theShader);
    p.rect(p.width * -0.5, p.height * -0.5, p.width, p.height);

    // CAPTURE
    if (CanvasCapture.isRecording()) CanvasCapture.recordFrame();
  }

}

let thep5 = new p5(sketch, 'wavy-sketch');
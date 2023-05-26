const sketch = ( p ) => 
{
  let theShader;
  let f;
  let textGraphic;

  //let zoom = 1;
  let offset;
  let intPixDensity = 1;
  let displayWidth = 880;
  let displayHeight = 880;

  // GUI
  let gui;
  let params = {
    textTop: "TRAP",
    textBtm: "BANGER",
    color1: [255, 56, 56],
    color3: [0, 0, 255],
    
    speed: 0.7,
    speedMin: 0.01,
    speedMax: 1.0,
    speedStep: 0.001,

    zoom: 0.15,
    zoomMin: 0.01,
    zoomMax: 1.0,
    zoomStep: 0.001,

    textColor: [201, 255, 5],
    textScale: 1.0,
    textScaleMin: 0.2,
    textScaleMax: 1.8,
    textScaleStep: 0.001
  };

  const { CanvasCapture } = CanvasCaptureLib;

  p.preload = () => 
  {
    theShader = p.loadShader('vert.glsl', 'frag.glsl');
    f = p.loadFont("Nunito-SemiBold.ttf");
  }

  p.setup = () => 
  {
    p.frameRate(30);
    p.pixelDensity(intPixDensity);
    p.createCanvas(displayWidth, displayHeight, p.WEBGL);
    p.background(0);
    offset = p.createVector(0, 0);
    
    textGraphic = p.createGraphics(displayWidth, displayHeight, p.WEBGL);
    textGraphic.pixelDensity(intPixDensity);
    textGraphic.background(0);
    textGraphic.textFont(f);
    textGraphic.textSize(Math.round(displayWidth * 0.14) * params.textScale);
    textGraphic.textAlign(p.CENTER, p.CENTER);
    textGraphic.fill("#ffffff");
    textGraphic.text(params.textTop, Math.round(displayWidth*0.1), -(Math.round(displayHeight*0.12 * params.textScale)));
    textGraphic.text(params.textBtm, Math.round(displayWidth*0.1), Math.round(displayHeight*0.05 * params.textScale));
    
    //zoom = 0.15;
    offset.x = 50;

    p.initCapture();
    
    gui = p.createGui(p);
    gui.addObject(params);
    gui.setPosition((displayWidth + 50) * .5, 25);
  }

  p.draw = () => 
  {
    textGraphic.background(0);
    textGraphic.textSize(Math.round(displayWidth*0.14) * params.textScale);
    textGraphic.text(params.textTop, Math.round(displayWidth*0.1), -(Math.round(displayHeight*0.12 * params.textScale)));
    textGraphic.text(params.textBtm, Math.round(displayWidth*0.1), Math.round(displayHeight*0.05 * params.textScale));

    var y = (p.mouseY-(displayHeight/intPixDensity)) / p.min(1, p.windowWidth / p.windowHeight) + (displayHeight/intPixDensity);
    var py = (p.pmouseY-(displayHeight/intPixDensity)) / p.min(1, p.windowWidth / p.windowHeight) + (displayHeight/intPixDensity);
    
    theShader.setUniform("u_resolution", [p.width * intPixDensity, p.height * intPixDensity]);
    theShader.setUniform("u_time", p.millis() / (1500.0*(1-params.speed)+100));
    theShader.setUniform("u_offset", [-offset.x * intPixDensity, offset.y * intPixDensity]);
    theShader.setUniform("u_zoom", 1.0 / params.zoom);
    theShader.setUniform("u_mouse", [p.mouseX * intPixDensity, (p.height-y) * intPixDensity]);
    theShader.setUniform("u_text", textGraphic);
    theShader.setUniform("u_color1", [ p.red(p.color(params.color1))/100, p.green(p.color(params.color1))/100, p.blue(p.color(params.color1))/100 ]);
    theShader.setUniform("u_color3", [ p.red(p.color(params.color3))/100, p.green(p.color(params.color3))/100, p.blue(p.color(params.color3))/100 ]);
    theShader.setUniform("u_color2", [ p.red(p.color(params.textColor))/100, p.green(p.color(params.textColor))/100, p.blue(p.color(params.textColor))/100 ]);
    //p.noStroke();
    p.shader(theShader);
    p.rect(p.width * -0.5, p.height * -0.5, p.width, p.height);

    // CAPTURE
    if (CanvasCapture.isRecording()) CanvasCapture.recordFrame();
  }

  // INIT CAPTURE SETTINGS AND BINDINGS
  p.initCapture = () =>
  {
    CanvasCapture.init(p.canvas, {
      showRecDot: true,
      showAlerts: false,
      showDialogs: false,
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
      onExportFinish: () => {
        console.log(`Finished MP4 export.`);
    },
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

    const FFMPEGSERVER_OPTIONS = {
      name: 'demo-canvas-capture-ffmpeg',
    }
    //CanvasCapture.bindKeyToVideoRecord
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
}

let thep5 = new p5(sketch, 'wavy-sketch');
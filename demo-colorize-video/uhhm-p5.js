let video;
let gui;
let button;
let isPlaying = false;
let params = {
  color: [255, 0, 0],
  blendMode: ['OVERLAY', 'SOFT_LIGHT', 'LIGHTEST', 'SCREEN', 'ADD', 'DARKEST', 'DIFFERENCE', 'EXCLUSION', 'MULTIPLY', 'REPLACE', 'HARD_LIGHT', 'DODGE', 'BURN', 'BLEND']
};


function preload() {
  
}

function setup() {
  let canvasContainer = document.getElementById('canvas-container');
  let canvasWidth = canvasContainer.offsetWidth;
  let canvasHeight = canvasContainer.offsetHeight;
  
  // Create the canvas with the div's width and height
  let canvas = createCanvas(540, 540);
  
  
  // Attach the canvas to the div
  canvas.parent('canvas-container');
  
  // Load the video
  //video = createVideo('uhhm-td-fluid.mov'); // Safari, but not Chrome
  video = createVideo('uhhm-td-fluid-h264.mp4'); // Converted to h264 with ffmpeg
  //video = createVideo('uhhm-td-flock-h264.mp4');

  video.elt.setAttribute('playsinline', true);
  video.elt.setAttribute('autoplay', true);
  video.elt.setAttribute('loop', true);
  video.elt.setAttribute('nuted', true);

  video.volume(0);
  video.loop();
  video.hide();
  //video.autoplay(false);

  //video.play();
  
  // Create the GUI
  gui = createGui('Colorize');
  gui.addObject(params);
  gui.setPosition((canvas.width + 25), 25);
  button = createButton("Play")
  button.mousePressed(playVideo);
}

function draw() {
  background(220,220,220);
  //blendMode(MULTIPLY);
  //fill(220,220,220);
  //rect(0, 0, width, height);

  tint(255, 187);
  image(video, 0, 0, width, height);
  //blendMode(BLEND);
  
  blendMode(getBlendMode(params.blendMode));

  fill(params.color);
  rect(0, 0, width, height);

  // Reset the blend mode to normal
  blendMode(BLEND);
  
}

function playVideo() {
  video.loop(); // set the video to loop and start playing
}

function getBlendMode(value) {
  switch(value) {
      case 'BLEND':
          return BLEND;
          break;
      case 'ADD':
        return ADD;
          break;
      case 'DARKEST':
        return DARKEST;
          break;
      case 'LIGHTEST':
        return LIGHTEST;
          break;
      case 'DIFFERENCE':
        return DIFFERENCE;
          break;
      case 'EXCLUSION':
        return EXCLUSION;
          break;
      case 'MULTIPLY':
        return MULTIPLY;
          break;
      case 'SCREEN':
        return SCREEN;
          break;
      case 'REPLACE':
        return REPLACE;
          break;
      case 'OVERLAY':
        return OVERLAY;
          break;
      case 'HARD_LIGHT':
        return HARD_LIGHT;
          break;
      case 'SOFT_LIGHT':
        return SOFT_LIGHT;
          break;
      case 'DODGE':
        return DODGE;
          break;
      case 'BURN':
        return BURN;
          break;
  }
}
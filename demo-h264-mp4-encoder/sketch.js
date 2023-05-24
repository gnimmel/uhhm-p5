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

// make sure encoder is ready before use
function preload() {
  HME.createH264MP4Encoder().then(enc => {
      encoder = enc
      encoder.outputFilename = 'test'
      encoder.width = cwidth
      encoder.height = cheight
      encoder.frameRate = frate
      encoder.kbps = 50000 // video quality
      encoder.groupOfPictures = 5 // lower if you have fast actions.
      encoder.initialize()
  })

  theShader = loadShader('vert.glsl', 'frag.glsl')
	f = loadFont("Nunito-SemiBold.ttf")
  
}

function setup() {
  frameRate(frate)
  pixelDensity(1)
	createCanvas(cwidth, cheight, WEBGL)
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

  
  button = createButton('record')
  button.mousePressed(() => recording = true)
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

  // keep adding new frame
  if (recording) {
    var pixelData = new Uint8Array(width * height * 4)
    drawingContext.readPixels(0, 0, width, height, drawingContext.RGBA, drawingContext.UNSIGNED_BYTE, pixelData)

    var halfHeight = height / 2 | 0;  // the | 0 keeps the result an int
    var bytesPerRow = width * 4;

    // make a temp buffer to hold one row
    var temp = new Uint8Array(width * 4);
    for (var y = 0; y < halfHeight; ++y) {
      var topOffset = y * bytesPerRow;
      var bottomOffset = (height - y - 1) * bytesPerRow

      // make copy of a row on the top half
      temp.set(pixelData.subarray(topOffset, topOffset + bytesPerRow))

      // copy a row from the bottom half to the top
      pixelData.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow)

      // copy the copy of the top half row to the bottom half 
      pixelData.set(temp, bottomOffset)
    }
    console.log('recording')

    // 2D CONTEXT
    //encoder.addFrameRgba(drawingContext.getImageData(0, 0, encoder.width, encoder.height).data)

    // WEBGL CONTEXT
    encoder.addFrameRgba(pixelData)

    recordedFrames++
  }
  // finalize encoding and export as mp4
  if (recordedFrames === numFrames) {
      recording = false
      recordedFrames = 0
      console.log('recording stopped')

      encoder.finalize()
      const uint8Array = encoder.FS.readFile(encoder.outputFilename)
      const anchor = document.createElement('a')
      anchor.href = URL.createObjectURL(new Blob([uint8Array], { type: 'video/mp4' }))
      anchor.download = encoder.outputFilename
      anchor.click()
      encoder.delete()

      //preload() // reinitialize encoder
  }
}
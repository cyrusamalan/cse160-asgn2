
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

//Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get a_Position');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix){
        console.log('Failed to get u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if(!u_GlobalRotateMatrix){
        console.log('Failed to get u_GlobalRotateMatrix');
        return;
    }

    // storage location
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if(!u_Size){
        console.log('Failed to get u_Size');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

let eyeScaleX = 1;
let tailRotationAngle = 0;

function renderAllShapes(){
    var startTime = performance.now();

    var globalRotMat = new Matrix4();
    globalRotMat.rotate(-g_globalAngleY, 1, 0, 0)
             .rotate(-g_globalAngleX, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var body = new Cube();
    body.color = [0.95, 0.95, 0.95, 1.0];
    body.matrix.translate(0.5, -0.25, 0.0);
    body.matrix.rotate(90, 0, 0, 1);
    var bodyCoor = new Matrix4(body.matrix);
    body.matrix.scale(0.4, 1, 0.3);
    body.render();

    var neck = new Cube();
    neck.color = [0.95, 0.95, 0.95, 1.0];
    neck.matrix = bodyCoor;
    neck.matrix.translate(0.3, 0.69, 0.2);
    neck.matrix.scale(0.5, 0.29, -0.15);
    neck.matrix.rotate(10, 0, 0, 1);
    neck.matrix.rotate(g_neckAngle, 0, 0, 1);
    var neckCoor = new Matrix4(neck.matrix);
    neck.render();

    var head = new Cube();
    head.color = [0.1, 0.1, 0.1, 1.0];
    head.matrix = bodyCoor;
    head.matrix.translate(0.5, 0.7, 0.0);
    head.matrix.rotate(10, 0, 0, 1)
    head.matrix.rotate(g_headAngle, 0, 0, 1)
    var headCoor = new Matrix4(head.matrix);
    head.matrix.scale(0.4, 1, 1);
    head.render();

    var lefteye = new Cube();
    lefteye.color = [0.95, 0.95, 0.95, 1.0];
    lefteye.matrix = bodyCoor;
    var eyeCoor = new Matrix4(lefteye.matrix);
    lefteye.matrix.translate(0.6, 0.6, -0.05);
    if (shift){
        lefteye.matrix.scale(0.3 * eyeScaleX, 0.1, 0.1);
    }else{
        lefteye.matrix.scale(0.1, 0.1, 0.1);
        lefteye.matrix.rotate(g_eyeAngle, 0, 0, 1);
    }
    lefteye.render();

    var righteye = new Cube();
    righteye.color = [0.95, 0.95, 0.95, 1.0];
    righteye.matrix = eyeCoor;
    righteye.matrix.translate(0.6, 0.6, 1);
    if (shift){
        righteye.matrix.scale(0.3 * eyeScaleX, 0.3, 0.1);
    }else{
        righteye.matrix.scale(0.1, 0.1, 0.1);
        righteye.matrix.rotate(g_eyeAngle, 0, 0, 1);
    }
    righteye.render();


    var nose = new Cube();
    nose.color = [0.95, 0.95, 0.95, 1.0];
    nose.matrix = headCoor;
    nose.matrix.translate(0.4, 1, 0.4);
    nose.matrix.scale(0.05, 0.1, 0.3);
    nose.render();

    var leftEar = new Cube();
    leftEar.color = [0.0, 0.0, 0.0, 1.0];
    leftEar.matrix = headCoor;
    leftEar.matrix.translate(1.5, -10, 0.75);
    leftEar.matrix.scale(1, 0.5, 0.5);
    leftEar.matrix.scale(6,1,1)
    leftEar.matrix.rotate(0,0,0)
    leftEar.render();

    var rightEar = new Cube();
    rightEar.color = [0.0, 0.0, 0.0, 1.0];
    rightEar.matrix = headCoor;
    rightEar.matrix.translate(0, 0, -3);
    rightEar.matrix.scale(1,1,1)
    rightEar.matrix.rotate(0,0,0)
    rightEar.render();

   

    var tail = new Tube();
    tail.height = 5;
    tail.radius = 0.5;
    tail.color = [0.95, 0.95, 0.95, 1.0];
    tail.matrix.translate(0.5, -0.175, 0.125);
    tail.matrix.scale(0.05, 0.15, 0.05);
    tail.matrix.rotate(-90, 1, 1, 0);
    if(shift){
        tail.matrix.translate(0, -0.5, 0);
        tail.matrix.rotate(tailRotationAngle, 1, 0, 0);
    }
    
    tail.render();

    var leftArm_front = new Cube();
    leftArm_front.color =[0.0, 0.0, 0.0, 1.0];
    leftArm_front.matrix.translate(-0.45, -0.75, 0.0);
    leftArm_front.matrix.scale(0.1, 0.5, .1);
    leftArm_front.matrix.rotate(g_runAngle, 0, 0, 1);
    leftArm_front  .render();

    var rightArm_front = new Cube();
    rightArm_front.color = [0.0, 0.0, 0.0, 1.0];
    rightArm_front.matrix.translate(-0.45, -0.75, 0.2);
    rightArm_front.matrix.scale(0.1, 0.5, .1);
    rightArm_front.matrix.rotate(-g_runAngle, 0, 0, 1);
    rightArm_front.render();

    var leftLeg_back = new Cube();
    leftLeg_back.color =  [0.0, 0.0, 0.0, 1.0];
    leftLeg_back.matrix.translate(0.35, -0.75, 0.0);
    leftLeg_back.matrix.scale(0.1, 0.5, .1); // Increased leg length from 0.25 to 0.5
    leftLeg_back.matrix.rotate(g_runAngle, 0, 0, 1);
    leftLeg_back.render();

    var rightLeg_back = new Cube();
    rightLeg_back.color = [0.0, 0.0, 0.0, 1.0];
    rightLeg_back.matrix.translate(0.35, -0.75, 0.2);
    rightLeg_back.matrix.scale(0.1, 0.5, .1);
    rightLeg_back.matrix.rotate(-g_runAngle, 0, 0, 1);
    rightLeg_back.render();

   

    var duration = performance.now() - startTime;
    sendTexttoHTML(" ms:      " + Math.floor(duration) + "              FPS: " + Math.floor(10000 / duration), "numdot");
}

let g_globalAngleX = 0;
let g_globalAngleY = 0;

let g_animationOn = false;
let shift = false;

function funcShiftKey(event) {
    if (event.shiftKey && event.target === canvas) {
        shift = true;
        g_animationOn = false;
    } else {
        shift = false;
    }
}

let g_runAngle = 0;
let g_neckAngle = 0;
let g_headAngle = 0;
let g_eyeAngle = 0;
let  = 0;


function addActionsForHtmlUI(){
    document.getElementById('animationYellowOffButton').onclick = function () { g_animationOn = false; };
    document.getElementById('animationYellowOnButton').onclick = function () { g_animationOn = true; };

    document.getElementById('angleSlideX').addEventListener('mousemove', function () { g_globalAngleX = parseInt(this.value); renderAllShapes(); });
    document.getElementById('angleSlideY').addEventListener('mousemove', function () { g_globalAngleY = parseInt(this.value); renderAllShapes(); });
    document.getElementById('runAngle').addEventListener('mousemove', function () { g_runAngle = parseInt(this.value); renderAllShapes(); });
    document.getElementById('neckAngle').addEventListener('mousemove', function () { g_neckAngle = parseInt(this.value); renderAllShapes(); });
    document.getElementById('headAngle').addEventListener('mousemove', function () { g_headAngle = parseInt(this.value); renderAllShapes(); });
    document.getElementById('eyeAngle').addEventListener('mousemove', function () { g_eyeAngle = parseInt(this.value); renderAllShapes(); });
}

function sendTexttoHTML(text, htmlID) {
    var htmlElem = document.getElementById(htmlID);
    if (!htmlElem) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElem.innerHTML = text;
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

function tick() {
    g_seconds = performance.now()/1000 - g_startTime;

    if(g_animationOn){
        g_runAngle = 10 * Math.sin(g_seconds);
        g_neckAngle = 5 * Math.sin(g_seconds);
        g_headAngle = 5 * Math.sin(g_seconds);
    }else if (shift) {
        eyeScaleX = 0.5 + 0.5 * Math.sin(2*g_seconds);
        tailRotationAngle = 20 * Math.sin(g_seconds * 3);
    }
    renderAllShapes();
    requestAnimationFrame(tick);
}

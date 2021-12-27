
let video;
let poseNet;
let pose;
let skeleton;
let poseLabel = "Do Pose"
let brain;
let targeLabel;
let posesTarget = ['a','b','c']
let posesArray = ['Mountain', 'Palm Tree','Chair'];
var imgArray = new Array()
var poseImage;
var posesTargetCount;
var targetlabel;
var errorCounter;
var iterationCounter;
var poseCounter;
var target;
var countdown;
var timeLeft = 650;
var cal = 30;
var currentcalArray;
var currentcal;

function setup() {
  var canvasVideo = createCanvas(640, 480);
  canvasVideo.position(130,130);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  imgArray[0] = new Image();
  imgArray[0].src = 'hatha/moun-1.jpeg';
  imgArray[1] = new Image();
  imgArray[1].src = 'hatha/palm-2.jpeg';
  imgArray[2] = new Image();
  imgArray[2].src = 'hatha/chair-3.jpeg';
  

  poseCounter = 0;
  target = posesArray[poseCounter];
  document.getElementById("poseName").textContent = target;
  targetLabel = 0;  
  errorCounter = 0;
  iterationCounter = 0;
  document.getElementById("poseImg").src = imgArray[poseCounter].src;
  posesTargetCount = 0;
  
  countdown = 10;
  document.getElementById("time").textContent = "00:" + countdown;

  //GET CURRENTCAL FROM LOCALSTORAGE
  currentcalArray = JSON.parse(localStorage.getItem('CurrentCal'));
  currentcal = currentcalArray.burnedcal;;
  console.log(currentcal);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'hatha-pose/model-h1.json',
    metadata: 'hatha-pose/model_meta-h1.json',
    weights: 'hatha-pose/model.weights-h1.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function gotPoses(poses) {
  if(poses.length > 0){
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function brainLoaded(){
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
  let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      brain.classify(inputs, gotResult);
  } else {
  console.log("Pose not found !")
  setTimeout(classifyPose, 100);
}
}

// console.log(timeLeft);
function gotResult(error, results) {
  poseLabel = results[0].label;
  //console.log(poseLabel);
    //console.log(results[0].confidence);
  classifyPose();
  if(results[0].confidence > 0.90){
    if (results[0].label == posesTarget[posesTargetCount]){
      iterationCounter = iterationCounter + 1;
      if( iterationCounter == 650 ){
        document.getElementById("status").textContent = "welldone!"; 
        iterationCounter = 0;
        
        console.log('next pose');
        nextPose();
      }else{
        timeLeft = timeLeft - 1;
        console.log(timeLeft);
        if(0 < timeLeft < 650 ){
          document.getElementById("status").textContent = "nice keep posing";
          if(timeLeft%65 == 0 && timeLeft > 0){
            countdown = countdown - 1;
            document.getElementById("time").textContent = "00:0" + countdown;
          }     
        }
        if(timeLeft<0){
          document.getElementById("status").textContent = "finished all poses";
        }
      }  
    }
  }else{
      
    }

}

function dataReady() {
  brain.normalizeData()
  brain.train({epochs: 50}, finished);
}

function finished() {
  console.log('model trained');
  brain.save();
}

function modelLoaded() {
  console.log('poseNet ready');
}

function nextPose(){
  console.log(poseCounter,'poseCounter');
  cal = cal + 10;
  document.getElementById("calories").textContent = cal + " KCAL";
  if (poseCounter >= 2) {
    document.getElementById("time").textContent = "00:10";
    
    const calperround = {
      calround : cal
    }
    localStorage.setItem("Calperround", JSON.stringify(calperround));

    currentcal = currentcal + cal;
    console.log('currentcal_update', currentcal);

    const burnupdated = {
      burnedcalupdate : currentcal
    }
    localStorage.setItem("AfterBurned", JSON.stringify(burnupdated));

    document.getElementById("next").style.display = 'block';
  }else{
    iterationCounter = 0;
    posesTargetCount = posesTargetCount + 1;
    poseCounter = poseCounter + 1;
    target = posesArray[poseCounter];
    document.getElementById("poseName").textContent = target;
    document.getElementById("poseImg").src = imgArray[poseCounter].src;
    timeLeft = 650;
    countdown = 10;
    document.getElementById("time").textContent = "00:" + countdown;
    setTimeout(classifyPose, 4000)}
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(8);
      stroke(244,194,194);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }


  pop();
  
  noStroke();
  textSize(50);
  textAlign(CENTER, BOTTOM);
  if (poseLabel == 'i'){
    fill(255,0,0);
    text("wrong pose!",width/2,height/7);
  }
  if (poseLabel == 'o'){
    fill(255,0,0);
    text("wrong pose!",width/2,height/7);
  }
  if (poseLabel == 'p'){
    fill(255,0,0);
    text("wrong pose!",width/2,height/7);
  }
  if (poseLabel == 'a'){
    fill(81,159,96);
    text("Mountain correct!",width/2,height/7);
  }
  if (poseLabel == 'b'){
    fill(86,149,232);
    text("Palm Tree correct!",width/2,height/7);
  }
  if (poseLabel == 'c'){
    fill(245,189,224);
    text("Chair correct!",width/2,height/7);
  }
}
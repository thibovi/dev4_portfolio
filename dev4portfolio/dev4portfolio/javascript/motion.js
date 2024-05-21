document.getElementById('motion').onclick = requestMotionPermission;

const fortunes = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "A fresh start will put you on your way.",
  "A friend asks only for your time, not your money.",
  "A golden opportunity is coming your way.",
  "All your hard work will soon pay off.",
  "An exciting opportunity lies ahead of you.",
  "Believe in yourself and others will too.",
  "Do not let ambitions overshadow small success.",
  "Embrace change, it is the only constant.",
  "Hard work pays off in the future, laziness pays off now."
];

let currentFortune = "Your fortune awaits...";
let shaken = false; 

function setup() {
createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(245);
  fill(255, 223, 186); 
  stroke(139, 69, 19); 
  strokeWeight(5);
  beginShape();
  vertex(200, 600);
  bezierVertex(200, 400, 600, 400, 600, 600);
  bezierVertex(600, 800, 200, 800, 200, 600);
  endShape(CLOSE);

  fill(0);
  noStroke();
  if (shaken) {
    text(currentFortune, width / 2, height / 2);
  }
  
  if (abs(rotationX - pRotationX) > 5 || abs(rotationY - pRotationY) > 5 || abs(rotationZ - pRotationZ) > 3) {
    currentFortune = random(fortunes);
    shaken = true; 
  }
}

function requestMotionPermission() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', () => {});
        }
      })
      .catch(console.error);
  } else {

    window.addEventListener('devicemotion', () => {});
  }
}

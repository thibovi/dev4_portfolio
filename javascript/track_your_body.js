let handpose;
let video;
let staven = [];
let score = 0;
let timerSeconds = 30; // 30 seconden timer
let timerInterval;
let timerElement;
let retryButton;

function setup() {
    let canvas = createCanvas(640, 480);
    canvas.parent('canvas-container'); // Toewijzen van het canvas aan de 'canvas-container' div
    background(255);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video capture element

    handpose = ml5.handpose(video, modelReady);
    handpose.on('predict', gotHands);

    // Voeg een initiële staaf toe
    staven.push(new Staaf(random(width), random(height - 100)));

    // Start de timer
    timerElement = createDiv(`Timer: ${timerSeconds}`);
    timerElement.id('timer');
    timerElement.position(20, 20);
    startTimer();
}

function modelReady() {
    console.log('Model ready!');
}

function gotHands(predictions) {
    if (predictions.length > 0) {
        let hand = predictions[0].landmarks;
        let indexTip = hand[8]; // Tip of index finger

        // Check if the index finger tip is close to any staaf
        for (let i = staven.length - 1; i >= 0; i--) {
            let staaf = staven[i];
            let d = dist(indexTip[0], indexTip[1], staaf.x, staaf.y);
            if (d < 50) { // Assuming a distance threshold of 50 pixels
                // Remove the staaf
                staven.splice(i, 1);

                // Increase score
                score++;

                // Respawn the staaf at a random position
                let newX = random(width);
                let newY = random(height - 100);
                staven.push(new Staaf(newX, newY));

                // Break the loop since we found the closest staaf
                break;
            }
        }
    }
}

function draw() {
    background(220);

    // Draw video feed on canvas
    image(video, 0, 0, width, height);

    // Draw staven
    for (let staaf of staven) {
        staaf.display();
    }

    // Draw score
    textSize(24);
    fill(0);
    text(`Score: ${score}`, 20, 40);
}

class Staaf {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    display() {
        fill(139, 69, 19);
        rectMode(CENTER);
        rect(this.x, this.y, 30, 100);
    }
}

function keyPressed() {
    if (key === ' ') {
        // Add a new staaf at a random position
        let newX = random(width);
        let newY = random(height - 100);
        staven.push(new Staaf(newX, newY));
    }
}

function startTimer() {
    let timer = timerSeconds;
    timerInterval = setInterval(() => {
        timer--;
        timerElement.html(`Timer: ${timer}`);
        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    // Verberg het canvas en de timer
    select('#canvas-container').hide();
    timerElement.hide();

    // Toon de retry knop
    retryButton = createButton('Probeer Opnieuw');
    retryButton.position(width / 2 - 50, height / 2);
    retryButton.mousePressed(restartGame);

    // Toon de score
    textSize(24);
    fill(0);
    text(`Je score is: ${score}`, width / 2 - 50, height / 2 - 40);
}

function restartGame() {
    // Reset de score
    score = 0;

    // Reset de timer
    clearInterval(timerInterval);
    timerElement.html(`Timer: ${timerSeconds}`);

    // Verwijder de retry knop
    retryButton.remove();

    // Reset het canvas en de timer
    select('#canvas-container').show();
    timerElement.show();

    // Reset de array met staven
    staven = [];
    staven.push(new Staaf(random(width), random(height - 100)));

    // Start een nieuwe timer
    startTimer();
}

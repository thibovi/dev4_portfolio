var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var synth = window.speechSynthesis;
var questionIndex = 0;
var points = 0; // Initialize points counter
var questions = [
    {
        question: "What is the capital of France?",
        answer: "Paris"
    },
    {
        question: "What is the chemical symbol for water?",
        answer: "H2O"
    },
    {
        question: "How many continents are there?",
        answer: "seven"
    },
    {
        question: "What is the largest mammal?",
        answer: "blue whale"
    },
    {
        question: "What is the largest planet in our solar system?",
        answer: "Jupiter"
    },
    {
        question: "who is the first president of the United States?",
        answer: "George Washington"
    },
    {
        question: "What is the capital of India?",
        answer: "New Delhi"
    },
    {
        question: "What is the chemical symbol for gold?",
        answer: "Au"
    },
    {
        question: "How many planets are there in our solar system?",
        answer: "eight"
    },
    {
        question: "What is the largest animal on Earth?",
        answer: "blue whale"
    },
    {
        question: "What is the smallest planet in our solar system?",
        answer: "Mercury"
    },

];

function askQuestion() {
    if (questionIndex < questions.length) {
        var question = questions[questionIndex].question;
        var questionDiv = document.getElementById('question');
        var currentQuestion = questionDiv.textContent;

        // Only ask the question if it is different from the current question
        if (question !== currentQuestion) {
            questionDiv.textContent = question;
            speak(question);
        }
    } else {
        document.getElementById('question').textContent = "Quiz Finished! Total Points: " + points; // Display total points
    }
}

function speak(text) {
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

function clearResult() {
    document.getElementById('result').textContent = '';
}

recognition.onresult = function(event) {
    var speechResult = event.results[0][0].transcript.trim();
    var answer = questions[questionIndex].answer;
    console.log("Speech Result:", speechResult);
    console.log("Expected Answer:", answer);
    if (speechResult.toLowerCase() === answer.toLowerCase()) {
        document.getElementById('result').textContent = "Correct!";
        points++; // Increment points counter for correct answer
    } else {
        document.getElementById('result').textContent = "Incorrect! The correct answer is: " + answer;
    }
    setTimeout(clearResult, 3000);
    questionIndex++;
    setTimeout(function() {
        askQuestion();
        document.getElementById('points').textContent = "Points: " + points; + "Out Of Ten"// Update points counter
    }, 3000);
}

recognition.onerror = function(event) {
    console.error('Speech recognition error detected: ' + event.error);
}

document.getElementById('speakButton').addEventListener('click', function() {
    recognition.start();
    askQuestion();
});

// Add event listener to stop recognition when speak button is not pressed
document.getElementById('speakButton').addEventListener('mouseup', function() {
    recognition.stop();
});

askQuestion();
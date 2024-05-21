document.addEventListener('DOMContentLoaded', function () {
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const snapSoundElement = document.getElementById('snapSound');
    const captureBtn = document.getElementById('capture-btn');
    const resultDiv = document.getElementById('result');

    // Create a webcam instance
    const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

    // Wait for ml5 to load
    ml5.imageClassifier('MobileNet').then(classifier => {
        console.log('Model loaded');
        
        // Start the webcam
        webcam.start()
            .then(result => {
                console.log("Webcam started");
            })
            .catch(err => {
                console.error("Error starting webcam:", err);
            });

        // Event listener for capture button
        captureBtn.addEventListener('click', async () => {
            // Take snapshot
            const img = webcam.snap();

            // Display snapshot
            resultDiv.innerHTML = '<img src="' + img + '" style="max-width: 100%;" />';

            // Make a prediction with MobileNet
            const image = new Image();
            image.src = img;
            image.onload = () => {
                classifier.classify(image, (err, results) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(results);
                    // Display prediction results
                    let predictionText = '<p>Prediction: ' + results[0].label + '</p>';
                    predictionText += '<p>Confidence: ' + results[0].confidence.toFixed(4) + '</p>';
                    resultDiv.innerHTML += predictionText;
                });
            };
        });
    });
});

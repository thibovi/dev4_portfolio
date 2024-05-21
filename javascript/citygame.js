
let map;
let score = 0;
let timer;
let locationMarker;
let locationCircle;

const treasures = [
  { name: "Treasure 1", location: [50.971765, 4.589812], challenge: "Solve a riddle to unlock the treasure!" },
  { name: "Treasure 2", location: [50.979493, 4.585300], challenge: "Find the hidden code to unlock the treasure!" },
  // Voeg meer schatten toe indien gewenst...
];

function initMap() {
  map = L.map('map').setView([50.850346, 4.351721], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);
}

function startGame() {
  score = 0;
  updateScore();
  startTimer(300); // 5 minutes
  displayTreasures();
  trackUserLocation(); // Start tracking user's location
}

function displayTreasures() {
  treasures.forEach((treasure, index) => {
    let marker = L.marker(treasure.location).addTo(map).bindPopup(treasure.name);
    marker.treasureIndex = index; // Store the index of the treasure in the marker object
  });
}

function startTimer(duration) {
  let timerDisplay = document.getElementById('timer');
  let timeLeft = duration;
  timer = setInterval(function () {
    timeLeft--;
    timerDisplay.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Game over!");
    }
  }, 1000);
}

function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

function updateScore() {
  document.getElementById('score').textContent = "Score: " + score;
}

function onLocationFound(e) {
  let userLocation = e.latlng;
  if (locationMarker) {
    locationMarker.setLatLng(userLocation);
    locationCircle.setLatLng(userLocation);
  } else {
    locationMarker = L.marker(userLocation).addTo(map)
    .bindPopup("U bent hier").openPopup();
  }
  map.setView(userLocation); // Center the map on user's location

  // Check distance to each treasure
  treasures.forEach((treasure, index) => {
    let distance = userLocation.distanceTo(L.latLng(treasure.location));
    if (distance < 20) {
      alert("You are near " + treasure.name + "!"); // Display alert
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker && layer.treasureIndex === index) {
          map.removeLayer(layer); // Remove the treasure marker from the map
        }
      });
      treasures.splice(index, 1); // Remove the treasure from the array
    }
  });
}

function onLocationError() {
  alert("Geolocation is not supported by this browser.");
}

function trackUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      onLocationFound({ latlng: L.latLng(position.coords.latitude, position.coords.longitude), accuracy: position.coords.accuracy });
    }, onLocationError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

document.getElementById('btn-start-game').addEventListener("click", function() {
  initMap();
  startGame();
});

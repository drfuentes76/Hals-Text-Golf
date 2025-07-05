
const holes = [
  { number: 1, par: 4, distance: 400 },
  { number: 2, par: 3, distance: 180 },
  { number: 3, par: 5, distance: 510 },
];

let currentHole = 0;
let remainingDistance = 0;
let strokes = 0;
let playerName = '';

const clubDistances = {
  "Driver": 230,
  "3 Wood": 210,
  "5 Iron": 180,
  "7 Iron": 140,
  "9 Iron": 110,
  "Wedge": 60,
  "Putter": 10
};

function startGame() {
  playerName = document.getElementById('playerName').value || "Player";
  document.getElementById('gameUI').style.display = 'block';
  loadHole();
}

function loadHole() {
  const hole = holes[currentHole];
  remainingDistance = hole.distance;
  strokes = 0;
  document.getElementById('holeInfo').innerText =
    `Hole ${hole.number}: Par ${hole.par}, ${hole.distance} yards.`;
  document.getElementById('terrainInfo').innerText =
    `Tee box. ${remainingDistance} yards to hole.`;
  speakText(`Hole ${hole.number}, Par ${hole.par}, ${hole.distance} yards.`);
}

function takeShot() {
  const club = document.getElementById('clubSelect').value;
  const power = parseInt(document.getElementById('powerInput').value);
  let distance = Math.floor(clubDistances[club] * (power / 100));
  remainingDistance -= distance;
  strokes++;

  document.getElementById('swingSound').play();

  let terrain = "fairway";
  if (remainingDistance < 30 && club !== "Putter") terrain = "rough";
  if (remainingDistance < 10 && club === "Putter") terrain = "green";
  if (remainingDistance <= 0) {
    remainingDistance = 0;
    document.getElementById('holeSound').play();
    document.getElementById('shotResult').innerText =
      `Ball holed in ${strokes} strokes!`;
    speakText(`Ball in hole. ${strokes} strokes.`);
    currentHole++;
    if (currentHole < holes.length) {
      setTimeout(loadHole, 2000);
    } else {
      document.getElementById('holeInfo').innerText = "Game complete!";
      speakText("Game complete!");
    }
    return;
  }

  const result = `Shot ${strokes}: Ball flew ${distance} yards. ${remainingDistance} yards remaining. Terrain: ${terrain}.`;
  document.getElementById('shotResult').innerText = result;
  document.getElementById('terrainInfo').innerText = `${remainingDistance} yards to hole.`;
  speakText(result);
  updateTicker(`${playerName} - Hole ${holes[currentHole].number} - ${strokes} strokes`);
}

function speakText(text) {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}

function updateTicker(text) {
  document.getElementById('leaderboardTicker').innerText = text;
}

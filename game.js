
const holes = [
  { number: 1, par: 4, distance: 400 },
  { number: 2, par: 3, distance: 180 },
  { number: 3, par: 5, distance: 510 },
];

let currentHole = 0;
let remainingDistance = 0;
let strokes = 0;
let playerName = '';
let stats = [];
let wind = 0;

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
  stats = [];
  currentHole = 0;
  loadHole();
}

function loadHole() {
  const hole = holes[currentHole];
  wind = Math.floor(Math.random() * 21) - 10;
  remainingDistance = hole.distance;
  strokes = 0;
  document.getElementById('holeInfo').innerText = 
    `Hole ${hole.number}: Par ${hole.par}, ${hole.distance} yards.`;
  document.getElementById('terrainInfo').innerText = 
    `${remainingDistance} yards to hole.`;
  document.getElementById('weatherInfo').innerText =
    `Wind: ${wind} mph`;
  speakText(`Hole ${hole.number}, Par ${hole.par}, ${hole.distance} yards. Wind: ${wind} miles per hour.`);
}

function takeShot() {
  const club = document.getElementById('clubSelect').value;
  const power = parseInt(document.getElementById('powerInput').value);
  let distance = Math.floor(clubDistances[club] * (power / 100)) + wind;
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
    stats.push(strokes);
    currentHole++;
    if (currentHole < holes.length) {
      setTimeout(loadHole, 2500);
    } else {
      endGame();
    }
    return;
  }

  const result = `Shot ${strokes}: Ball flew ${distance} yards. ${remainingDistance} yards remaining. Terrain: ${terrain}.`;
  document.getElementById('shotResult').innerText = result;
  document.getElementById('terrainInfo').innerText = `${remainingDistance} yards to hole.`;
  speakText(result);
  updateTicker(`${playerName} - Hole ${holes[currentHole].number} - ${strokes} strokes`);
}

function endGame() {
  let summary = "Game Over!\n";
  let total = 0;
  stats.forEach((s, i) => {
    summary += `Hole ${i+1}: ${s} strokes\n`;
    total += s;
  });
  summary += `Total Strokes: ${total}`;
  document.getElementById('statsOutput').innerText = summary;
  speakText("Game complete. Total strokes " + total);
}

function speakText(text) {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}

function updateTicker(text) {
  document.getElementById('leaderboardTicker').innerText = text;
}

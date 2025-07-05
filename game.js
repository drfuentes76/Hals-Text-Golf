
function startGame() {
  document.getElementById('gameUI').style.display = 'block';
  const name = document.getElementById('playerName').value;
  document.getElementById('gameStatus').innerText = 'Welcome ' + name + '! Select your club and power.';
  speakText('Welcome ' + name + '. Game started.');
  updateTicker(name + ' - Hole 1 - E');
}

function takeShot() {
  const club = document.getElementById('clubSelect').value;
  const power = parseInt(document.getElementById('powerInput').value);
  const result = `You swung your ${club} at ${power}% power.`;
  document.getElementById('shotResult').innerText = result;
  speakText(result);
}

function speakText(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  window.speechSynthesis.speak(msg);
}

function updateTicker(text) {
  document.getElementById('leaderboardTicker').innerText = text;
}

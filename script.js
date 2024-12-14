let playerScore = 0;
let aiScore = 0;
let roundsPlayed = 0;
const totalRounds = 5;
let gameMode = '';
let playerChoice = '';
let friendChoice = '';
let isPlayerReady = false;
let isFriendReady = false;
let tournamentMode = false;
let tournamentRounds = totalRounds;

// Get DOM elements
const startBtn = document.querySelector('.start-btn');
const modeSelectionScreen = document.querySelector('.mode-selection-screen');
const gameScreen = document.querySelector('.game-screen');
const endScreen = document.querySelector('.end-screen');
const roundsPlayedElement = document.getElementById('rounds-played');
const playerScoreElement = document.getElementById('player-score');
const aiScoreElement = document.getElementById('ai-score');
const resultElement = document.getElementById('result');
const finalWinnerElement = document.getElementById('final-winner');
const playAgainBtn = document.querySelector('.play-again-btn');
const choices = document.querySelectorAll('.choice-btn');

startBtn.addEventListener('click', () => {
  document.querySelector('.start-screen').style.display = 'none';
  modeSelectionScreen.style.display = 'block';
});

document.getElementById('play-ai').addEventListener('click', () => {
  gameMode = 'AI';
  startGame();
});

document.getElementById('play-friend').addEventListener('click', () => {
  gameMode = 'Friend';
  startGame();
});

document.getElementById('play-tournament').addEventListener('click', () => {
  gameMode = 'Tournament';
  startGame();
});

function startGame() {
  modeSelectionScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  resetGame();
  tournamentMode = gameMode === 'Tournament';
  // Disable mouse clicks for 'Friend' mode and enable only keyboard functionality
  if (gameMode === 'Friend') {
    choices.forEach(choice => {
      choice.removeEventListener('click', mouseChoiceSelection);
    });
  } else {
    choices.forEach(choice => {
      choice.addEventListener('click', mouseChoiceSelection);
    });
  }
}

function resetGame() {
  playerScore = 0;
  aiScore = 0;
  roundsPlayed = 0;
  playerScoreElement.textContent = playerScore;
  aiScoreElement.textContent = aiScore;
  roundsPlayedElement.textContent = roundsPlayed;
  resultElement.textContent = '';
  playerChoice = '';
  friendChoice = '';
  isPlayerReady = false;
  isFriendReady = false;
  tournamentRounds = totalRounds;
}

function mouseChoiceSelection() {
  if (roundsPlayed < tournamentRounds) {
    playerChoice = this.id; // Use the id of the clicked element (stone, paper, scissors)
    playRound(playerChoice);
  }
}

document.addEventListener('keydown', (e) => {
  if (gameMode === 'Friend' && roundsPlayed < tournamentRounds) {
    if (!isPlayerReady && (e.key === '1' || e.key === '2' || e.key === '3')) {
      if (e.key === '1') {
        playerChoice = 'stone';
      } else if (e.key === '2') {
        playerChoice = 'paper';
      } else if (e.key === '3') {
        playerChoice = 'scissors';
      }
      isPlayerReady = true;
    }

    if (!isFriendReady && (e.key === 'q' || e.key === 'w' || e.key === 'e')) {
      if (e.key === 'q') {
        friendChoice = 'stone';
      } else if (e.key === 'w') {
        friendChoice = 'paper';
      } else if (e.key === 'e') {
        friendChoice = 'scissors';
      }
      isFriendReady = true;
    }

    if (isPlayerReady && isFriendReady) {
      playRound(playerChoice, friendChoice);
      isPlayerReady = false;
      isFriendReady = false;
    }
  }
});

function playRound(playerChoice, friendChoice) {
  let aiChoice = '';
  if (gameMode === 'AI' || gameMode === 'Tournament') {
    aiChoice = getAIChoice();
  }

  const roundResult = determineWinner(playerChoice, friendChoice || aiChoice);
  updateScore(roundResult);

  roundsPlayed++;
  roundsPlayedElement.textContent = roundsPlayed;

  resultElement.textContent = `You chose ${playerChoice}, ${gameMode === 'AI' ? 'AI' : 'Friend'} chose ${friendChoice || aiChoice}. ${roundResult}`;

  if (roundsPlayed === tournamentRounds) {
    setTimeout(showWinner, 1000);
  }
}

function getAIChoice() {
  const choices = ['stone', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(playerChoice, opponentChoice) {
  if (playerChoice === opponentChoice) {
    return 'It\'s a tie!';
  }
  if (
    (playerChoice === 'stone' && opponentChoice === 'scissors') ||
    (playerChoice === 'paper' && opponentChoice === 'stone') ||
    (playerChoice === 'scissors' && opponentChoice === 'paper')
  ) {
    return 'You win!';
  }
  return 'You lose!';
}

function updateScore(result) {
  if (result === 'You win!') {
    playerScore++;
    playerScoreElement.textContent = playerScore;
  } else if (result === 'You lose!') {
    aiScore++;
    aiScoreElement.textContent = aiScore;
  }
}

function showWinner() {
  gameScreen.style.display = 'none';
  endScreen.style.display = 'block';

  if (playerScore > aiScore) {
    finalWinnerElement.textContent = 'You are the Winner!';
  } else if (playerScore < aiScore) {
    finalWinnerElement.textContent = 'Opponent is the Winner!';
  } else {
    finalWinnerElement.textContent = 'It\'s a Tie!';
  }
}

playAgainBtn.addEventListener('click', () => {
  document.querySelector('.start-screen').style.display = 'block';
  endScreen.style.display = 'none';
});

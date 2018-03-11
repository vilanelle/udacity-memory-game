/*  DOM elements & global variables */

const cards = Array.from(document.getElementsByClassName('card'));
const stars = Array.from(document.getElementsByClassName('star'));
const resetButton = document.getElementsByClassName('restart')[0];
const popup = document.getElementById('popup');
const closePopupButton = document.getElementById('closePopup');
const movesInfo = document.getElementById('moves');
const ratingInfo = document.getElementById('rating-info');
const timeInfo = document.getElementById('time-info');
const timer = document.getElementById('timer-display');
const playAgainButton = document.getElementById('playAgain');
const notPlayAgainButton = document.getElementById('notPlayAgain');

// cards after shuffling
let shuffledCards;
// player move count
let moves = 0;
// rating
let rating = 3;
// currently active cards
let openCards = [];
// correct quesses counter
let correctGuesses = [];
// timer, minutes, seconds
let ticker;
let minutes = 0, seconds = 0;


// FUNCTIONS
// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Update moves count
const movesDisplay = document.getElementsByClassName('moves')[0];
const updateMoves = () => {
	movesDisplay.textContent = moves;
}

// Update player star rating view

const updateRating = () => {
	if (moves > 10) {
		stars[2].innerHTML = '<i class="far fa-star"></i>';
		rating--;
	}
	if (moves > 14) {
		stars[1].innerHTML = '<i class="far fa-star"></i>';
		rating--;
	}
	if (moves > 20) {
		stars[0].innerHTML = '<i class="far fa-star"></i>';
		rating--;
	}
}

// Reset player rating
const resetRating = () => {
	stars.forEach(star => star.innerHTML = '<i class="fa fa-star"></i>');
}

// Shuffle cards and display them
const shuffleAndDisplayCards = (array) => {
	array = shuffle(array);
	// get deck element and add shuffled cards to it
	const deck = document.getElementsByClassName('deck')[0];
	let shuffled = '';
	array.forEach(el => {
		shuffled += el.outerHTML;
	});
	deck.innerHTML = shuffled;
	// add click listeners to cards
	shuffledCards = Array.from(document.getElementsByClassName('card'));
	shuffledCards.forEach(card => card.addEventListener('click', handleCardClick));
	// keep cards open  for tests
	// shuffledCards.forEach(card => card.classList.add('show'));
}

// Reset game
const resetGame = () => {
	moves = 0;
	shuffleAndDisplayCards(cards);
	resetRating();
	updateMoves();
	openCards.length = 0;
	correctGuesses = 0;
	resetTimer();
}

// Reset with confirmation
const confirmedReset = () => {
	let confirmation = confirm('Are you sure you want to reset your game?');
	if (confirmation) {
		resetGame();
	}
}

// Popup functions
const togglePopup = () => {
	movesInfo.innerHTML = moves;
	let time = document.getElementById('timer-display').innerHTML;
	timeInfo.innerHTML = `Your time is ${time}!`;
	ratingInfo.innerHTML = rating === 1 ? `Your rating is ${rating} star!` : `Your rating is ${rating} stars!`;
	popup.style.display = 'block';
}

const playAgain = () => {
	popup.style.display = 'none';
	resetGame();
	startGame();
}

const notPlayAgain = () => {
	popup.style.display = 'none';
}


// Do all the game logic on card click
const handleCardClick = (e) => {
	const cardClicked = e.currentTarget;
	cardClicked.removeEventListener('click', handleCardClick);
	// display card background & symbol
	cardClicked.classList.add('show', 'open');
	// check if another card open
	if (openCards.length === 0) {
		openCards.push(cardClicked);
		return;
	}
	// on two cards clicked
	if (openCards.length === 1) {
		shuffledCards.forEach(card => card.removeEventListener('click', handleCardClick));
		openCards.push(cardClicked);
		if (openCards[0].isEqualNode(cardClicked)) {
			openCards.forEach(card => {
				card.classList.add('match')
			});
			shuffledCards.forEach(card => {
				if (!card.classList.contains('match')) {
					card.addEventListener('click', handleCardClick);
				}
			});
			correctGuesses++;
			// check for win
			if (correctGuesses === 8) {
				moves++;
				togglePopup();
				updateRating();
				updateMoves();
				stopTimer();
				return;
			}
			openCards.length = 0;

		} else {
			setTimeout(function() {
				openCards.forEach(card => {
					card.classList.remove('open', 'show');
				});
				openCards.length = 0;
				moves++;
				updateRating();
				updateMoves();
				shuffledCards.forEach(card => {
					if (!card.classList.contains('match')) {
						card.addEventListener('click', handleCardClick);
					}
				});
			}, 600);
		}
	}
}

// Timer functions

const startTimer = () => {
		ticker = setInterval(function() {
		seconds = parseInt(seconds % 60, 10);
		seconds = seconds < 10 ? "0" + seconds : seconds;
		minutes = minutes === 0 ? "00" : minutes;
		timer.innerHTML = minutes + ":" + seconds;
		seconds++;
		if(seconds === 60){
			minutes++;
			minutes = minutes < 10 ? "0" + minutes : minutes;
		}
	}, 1000);
}

const stopTimer = () => {
	clearInterval(ticker);
}

const resetTimer = () => {
	minutes = 0;
	seconds = 0;
	timer.innerHTML= '00:00';
}

// start game
const startGame = () => {
	shuffleAndDisplayCards(cards);
	startTimer();
	updateMoves();
}
/* Event listeners */
// reset button
resetButton.addEventListener('click', confirmedReset);
// popup button
playAgainButton.addEventListener('click', playAgain);
notPlayAgainButton.addEventListener('click', notPlayAgain)

/* Game play */
startGame();

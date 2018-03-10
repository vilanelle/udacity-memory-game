/*  DOM elements */

const cards = Array.from(document.getElementsByClassName('card'));
const stars = Array.from(document.getElementsByClassName('star'));
const resetButton = document.getElementsByClassName('restart')[0];
const popup = document.getElementById('popup');
const closePopupButton = document.getElementById('closePopup');
const movesInfo = document.getElementById('moves');

// cards after shuffling
let shuffledCards;
// player move count
let moves = 0;
// currently active cards
let openCards = [];
// correct quesses counter
let correctGuesses = [];

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
  if (moves > 8) {
    stars[2].innerHTML = '<i class="far fa-star"></i>';
  }
  if (moves > 12) {
    stars[1].innerHTML = '<i class="far fa-star"></i>';
  }
  if (moves > 17) {
    stars[0].innerHTML = '<i class="far fa-star"></i>';
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
  popup.style.display = 'block';
}
const closePopup = () => {
  popup.style.display = 'none';
  resetGame();
}

// Do all the game logic on card click
const handleCardClick = (e) => {
  const cardClicked = e.currentTarget;
  // display card background & symbol
  cardClicked.classList.add('show', 'open');
  // cardClicked.classList.add('open');
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
      console.log('Match!');
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
      if (correctGuesses === 1) {
        console.log('win!');
        togglePopup();
        movesInfo.innerHTML = moves;
        return;
      }
      openCards.length = 0;
      moves++;
      updateRating();
      updateMoves();
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
      console.log('No match.');
    }
  }
}

/* Event listeners */
// reset button
resetButton.addEventListener('click', confirmedReset);
// popup button
closePopupButton.addEventListener('click', closePopup);


/* Game play */
// Start game
shuffleAndDisplayCards(cards);
updateMoves();

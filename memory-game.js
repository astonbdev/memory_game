"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

let score  = 0;

//Used to determine what cards are being compared
let currentCards = [];

//Used to handle win condition
let cardsLeft = []; 



createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  let breakCount = 0;
  for (let color of colors) {
    console.log("making card");
    const card = document.createElement("div");
    card.setAttribute("class", color);
    card.style.backgroundColor = "white";

    card.addEventListener("click", handleCardClick);
    
    if(breakCount === 5){
      gameBoard.append(document.createElement("br"));
      breakCount = 0;
    }

    cardsLeft.push(card);
    gameBoard.append(card);
    breakCount++;
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.getAttribute("class");
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundColor = "white";
  currentCards.splice(currentCards.indexOf(card),1);
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  
  //check for cards clicked to avoid too many clicks
  if(currentCards.length === 2){
    return;
  }

  let card = evt.target;
  
  //check if same card
  if(!currentCards.includes(card)){
    currentCards.push(card);
    flipCard(card);
  }
  
  //check for match
  if(currentCards.length === 2){
    score++;
    let scoreLabel = document.querySelector('#score');
    scoreLabel.innerText = "Score: " + score;
    let cardOne = currentCards[0].getAttribute("class").split(" ")[0];
    let cardTwo = currentCards[1].getAttribute("class").split(" ")[0];

    if(currentCards[0].getAttribute("class") !== currentCards[1].getAttribute("class")){
      for(card of currentCards){
        let cardTimeout = setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, card);
      }
    }
    else{
      for(card of currentCards){
        card.removeEventListener("click", handleCardClick);
        cardsLeft.splice(cardsLeft.indexOf(card),1);
        console.log("Cards Left: " + cardsLeft.length);
      }
      currentCards = [];
    }
    handleWin();
  }
}

/* creates win label, and reset button*/
function handleWin(){
  if(cardsLeft.length === 0){
    let winLabel = document.createElement("h2");
    winLabel.setAttribute("id", "winLabel");
    winLabel.innerText = "You Win!!";
    document.body.append(winLabel);
    document.body.append(document.createElement("br"));
    
    const boardResetButton = document.createElement("button");
    boardResetButton.setAttribute("id", "reset");
    boardResetButton.addEventListener("click", resetBoard);
    boardResetButton.innerText = "Play Again"
    document.body.append(boardResetButton);
  }
}

function resetBoard(){
  currentCards = [];
  cardsLeft = [];
  score = 0;
  document.querySelector("#score").innerText = "Score: " + score;

  removeAllCards();
  createCards(shuffle(COLORS));
  
}

function removeAllCards(){
  const gameBoard = document.querySelector("#game");
  gameBoard.innerHTML = '';

  let winLabel = document.querySelector("#winLabel");
  winLabel.remove();
  let resetBtn = document.querySelector("#reset");
  resetBtn.remove();
}
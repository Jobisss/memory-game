const cardSrcArray = [
  "images/emoji.png",
  "images/ovos.png",
  "images/snopi.png",
  "images/start.png",
  "images/titles.png",
  "images/udistoki.png",
  "images/vitorroque.png",
];
let totalCards = 0;
let tries = 0;
let done = 0;
let level = 1;
let max = 7;
let record = getRecord();
let info = document.getElementById("info");
let nextBtn = document.getElementById("nextLevel");
let endGameBtn = document.getElementById("endGame");
const errorSound = new Audio("sounds/erro.wav");
errorSound.volume = 0.1;
const acertoSound = new Audio("sounds/acerto.wav");
const winSound = new Audio("sounds/win.wav");
errorSound.load();
acertoSound.load();
winSound.load();
endGameBtn.style.display = "none";
nextBtn.style.display = "none";

let selectedCards = [];

function defineCardCount() {
  let cardsActual = cardSrcArray.slice(0, level);
  totalCards = cardsActual.length;
  let cardToDisplay = [...cardsActual, ...cardsActual];
  updateInfo();
  return cardToDisplay;
}

function getRecord() {
  return Number(window.localStorage.getItem("record")) || 0;
}

function setRecord() {
  window.localStorage.setItem("record", String(tries));
}

function increaseLevel() {
  done = 0;
  level++;
  reset();
}

function endGame() {
  if (record > tries || record == 0) {
    setRecord();
    record = tries;
  }
  endGameBtn.style.display = "none";
  nextBtn.style.display = "none";
  tries = 0
  done = 0;
  level = 1;
  reset();
}

function reset() {
  if (level > max) {
    tries = 0;
  }
  let container = document.getElementById("wrap-card-container");
  container.innerHTML = "";
  addToContainerCards(container);
  nextBtn.style.display = "none";
  selectedCards = [];
  updateInfo();
}

nextBtn.addEventListener("click", increaseLevel);
endGameBtn.addEventListener("click", endGame);

function updateInfo() {
  info.innerText = `Tentativas: ${tries} | Acertos: ${done}/${totalCards} | Record: ${record} | Level: ${level}/${max}`;
}

function verify() {
  let last = selectedCards[selectedCards.length - 1];
  let penult = selectedCards[selectedCards.length - 2];

  if (last.dataset.realSrc == penult.dataset.realSrc) {
    done++;
    if (done === totalCards) {
      if (level === max) {
        winSound.play()
        endGameBtn.style.display = "block";
      } else {
        nextBtn.style.display = "block";
      }
    }
    acertoSound.play()
    selectedCards = [];
  } else {
    errorSound.play()
    document.body.classList.add("shake");
    last.dataset.oppened = "false"
    penult.dataset.oppened = "false"

    setTimeout(() => {
      document.body.classList.remove("shake");
      last.classList.remove("clicked");
      penult.classList.remove("clicked");
      selectedCards = [];
    }, 1000);

    setTimeout(() => {
      last.src = "images/verso.png";
      penult.src = "images/verso.png";
    }, 1250);
  }

  updateInfo();
}

function createCard(src) {
  const card = document.createElement("img");
  card.dataset.realSrc = src;
  card.src = "images/verso.png";
  card.classList.add("card-container");
  card.dataset.oppened = "false"
  card.addEventListener("click", () => {
    if (!card.src.includes("images/verso.png") || selectedCards.length == 2) {
      return;
    }
    card.classList.add("clicked");
    card.dataset.oppened = "true"
    selectedCards.push(card);
    setTimeout(() => {
      card.src = card.dataset.realSrc;
    }, 250);
    if (selectedCards.length == 2) {
      tries++;
      verify();
    }
  });
  return card;
}

function addToContainerCards(container) {
  let cards = defineCardCount();
  let randomized = cards.sort(() => Math.random() - 0.5);
  for (let cardsrc of randomized) {
    let card = createCard(cardsrc);
    container.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let container = document.getElementById("wrap-card-container");
  addToContainerCards(container);
});

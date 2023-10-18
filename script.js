const restartBtn = document.querySelector('.restart_btn');
const gameStatistic = document.querySelector('.game-statistic');
const gameBoard = document.querySelector('.game-board');

// количество открытых карт
let flippedCards = 0;

// отключение клика
let disableClick = false;

// счетчик ходов
let score = 0;

const ROWS = 4;
const COLUMNS = 8;
const MAX_OPEN_CARDS = 2;


//перемешать карты
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

restartBtn.addEventListener('click', () => {
    score = 0;
    gameBoard.innerHTML = '';
    gameBoard.classList.remove('hide');
    gameStatistic.innerHTML = '';
    gameStatistic.classList.add('hide');
    createBoard();
});

function createBoard() {
    restartBtn.classList.add('hide');  
  // создание рядов
  for (let i = 0; i < ROWS; i++) {
    const row = document.createElement('div');
    row.classList.add('row');

    // создание карт в рядах
    for (let j = 0; j < COLUMNS; j++) {
      const card = document.createElement('div');
      card.addEventListener('click', handleCardClick);
      card.classList.add('card');
      row.appendChild(card);
    }

    gameBoard.appendChild(row);
  }
  cards = document.querySelectorAll('.card');

  const images = [];

  for (let i = 0; i < 16; i++) {
    images.push('images/card_' + i + '.jpg');
  }

  const shuffleCards = shuffle([...images, ...images]);
  
  // Добавление изображения к каждому карте
  for (let i = 0; i < cards.length; i++) {
    let img = document.createElement('img');
    img.src = shuffleCards[i];
    cards[i].appendChild(img);
  }
}

function handleCardClick(e) {
  // Если клик отключен или карта уже открыта, ничего не делаем
  if (disableClick || e.currentTarget.classList.contains('open')) {
    return;
  }
  // Открываем карту
  e.currentTarget.classList.add('open');
  // Увеличиваем счетчик открытых карт
  flippedCards++;
  // Если открыто две карты, проверяем совпадение
  if (flippedCards === MAX_OPEN_CARDS) {
    let openCards = document.querySelectorAll('div.card.open:not(.matched)');
    // Если карты совпадают
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
      disableClick = true;
      setTimeout(function () {
        openCards.forEach((openCard) => {
          openCard.classList.add('matched');
        });
        // Проверяем, завершена ли игра
        if (isGameEnd(cards.length)) {
            finishGame(score);
        }
        disableClick = false;
      }, 300);
    } else {
      // Если карты не совпадают, закрываем их
      disableClick = true; // временно отключаем клик, чтобы игрок не успел открыть другие карты
      setTimeout(function () {
        openCards.forEach((openCard) => openCard.classList.remove('open'));
        disableClick = false;
      }, 1500);
    }
    // Сбрасываем счетчик открытых карт
    flippedCards = 0;
    ++score; 
  }
}

function isGameEnd() {
  return document.getElementsByClassName('matched').length === cards.length;
}


function finishGame (score) {
    gameStatistic.classList.remove('hide');
    gameBoard.classList.add('hide');
    gameStatistic.innerHTML = `<h2 class="congratulation">Victory! You guessed all the cards in ${score} moves!<h2>`;
    restartBtn.classList.remove('hide');  
}

createBoard();

const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';

let xScore = 0;
let oScore = 0;
let isXTurn = true;
let isGameOver = false;

function changeToX(event) {
  if (isGameOver) return;

  const container = event.currentTarget;
  const image = document.createElement('img');
  const currentPlayer = isXTurn ? 'X' : 'O';

  // กำหนดรูปภาพ
  image.src = isXTurn ? X_IMAGE_URL : O_IMAGE_URL;

  container.classList.add(currentPlayer);
  container.appendChild(image);
  container.removeEventListener('click', changeToX);

  if (checkWinner(currentPlayer)) {
    isGameOver = true;
    updateScore(currentPlayer);
    setTimeout(() => alert(currentPlayer + " ชนะแล้ว!"), 100);
  }

  isXTurn = !isXTurn;
}

// ฟังก์ชันตรวจการชนะ
function checkWinner(player) {
  const boxes = document.querySelectorAll('#grid div');
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    return pattern.every(index => {
      return boxes[index].classList.contains(player);
    });
  });
}

// ฟังก์ชันอัปเดตคะแนน
function updateScore(winner) {
  if (winner === 'X') {
    xScore++;
    document.querySelector('#x-score').textContent = xScore;
  } else {
    oScore++;
    document.querySelector('#o-score').textContent = oScore;
  }
}

function resetGame() {
  const boxes = document.querySelectorAll('#grid div');
  for (const box of boxes) {
    box.innerHTML = '';
    box.classList.remove('X', 'O');
    box.addEventListener('click', changeToX);
  }
  isXTurn = true;
  isGameOver = false;
}

const boxes = document.querySelectorAll('#grid div');
for (const box of boxes) {
  box.addEventListener('click', changeToX);
}

document.querySelector('#reset-btn').addEventListener('click', resetGame);
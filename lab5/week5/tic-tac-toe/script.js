const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';
// Add event listeners?

let xScore = 0;
let oScore = 0;
let isXTurn = true;
let isGameOver = false;

function changeToX(event) {
  if (isGameOver) return;
  const container = event.currentTarget;// Get the element that was clicked
  const image = document.createElement('img');// Create an <img> tag with the X img src

  const currentPlayer = isXTurn ? 'X' : 'O';
  if (isXTurn) {
    image.src = X_IMAGE_URL;
    image.classList.add('x-color'); // <-- เพิ่มคลาสสีแดงให้ X
  } else {
    image.src = O_IMAGE_URL;
    image.classList.add('o-color'); // <-- เพิ่มคลาสสีน้ำเงินให้ O
  }
  image.src = isXTurn ? X_IMAGE_URL : O_IMAGE_URL;

  container.classList.add(currentPlayer);
  container.appendChild(image);
  container.removeEventListener('click', changeToX);

  if (checkWinner(currentPlayer)) {
    isGameOver = true;
    updateScore(currentPlayer);
    setTimeout(() => alert(currentPlayer + " ชนะแล้ว!"), 100);
  }

  container.appendChild(image);// Append that <img> tag to the element
  container.removeEventListener('click', changeToX)
  isXTurn = !isXTurn;
}

// ฟังก์ชันตรวจการชนะ
function checkWinner(player) {
  const boxes = document.querySelectorAll('#grid div');
  // กำหนดตำแหน่งที่ถ้าเรียงกันแล้วจะชนะ (Index 0-8)
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // แนวนอน
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // แนวตั้ง
    [0, 4, 8], [2, 4, 6]             // แนวทแยง
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
    box.classList.remove('X', 'O'); // ลบประวัติการเดินเก่าออก
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
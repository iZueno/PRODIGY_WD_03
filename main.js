function checkWin(board, player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return wins.some(combo => combo.every(i => board[i] === player));
}

function checkDraw(board) {
  return board.every(cell => cell !== "");
}

function getSmartAIMove(board) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (checkWin(board, "O")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (checkWin(board, "X")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  const priorities = [
    [0, 2, 6, 8], // corners
    [4],          // center
    [1, 3, 5, 7]  // sides
  ].sort(() => 0.5 - Math.random());

  for (let group of priorities) {
    for (let i of group) {
      if (board[i] === "") return i;
    }
  }

  return -1;
}

function drawBoard(board, handleClick) {
  const boardDiv = document.getElementById("game-board");
  boardDiv.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    if (board[i] === "X") {
      const img = document.createElement("img");
      img.src = "assets/x.png";
      cell.appendChild(img);
    } else if (board[i] === "O") {
      const img = document.createElement("img");
      img.src = "assets/o.png";
      cell.appendChild(img);
    }

    cell.addEventListener("click", handleClick);
    boardDiv.appendChild(cell);
  }
}

function updateStatus(player) {
  document.getElementById("status").innerText = "Turn: " + player;
}

function showWinner(message) {
  const popup = document.getElementById("winner-popup");
  const messageElement = document.getElementById("popup-message");

  messageElement.innerText = message;
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500);
}

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const drawSound = document.getElementById("draw-sound");
const aiToggle = document.getElementById("ai-toggle");

function handleClick(event) {
  const index = event.target.dataset.index;
  if (board[index] !== "" || gameOver) return;

  clickSound.play();
  board[index] = currentPlayer;
  drawBoard(board, handleClick);

  if (checkWin(board, currentPlayer)) {
    winSound.play();
    showWinner("🎉 Player " + currentPlayer + " Wins!");
    gameOver = true;
    return;
  }

  if (checkDraw(board)) {
    drawSound.play();
    showWinner("🤝 It's a Draw!");
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(currentPlayer);

  if (aiToggle.checked && currentPlayer === "O" && !gameOver) {
    updateStatus(" Thinking...");
    setTimeout(() => {
      const move = getSmartAIMove([...board]);
      board[move] = "O";
      drawBoard(board, handleClick);

      if (checkWin(board, "O")) {
        winSound.play();
        showWinner(" AI Wins!");
        gameOver = true;
      } else if (checkDraw(board)) {
        drawSound.play();
        showWinner("🤝 It's a Draw!");
        gameOver = true;
      } else {
        currentPlayer = "X";
        updateStatus(currentPlayer);
      }
    }, 600);
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;

  if (aiToggle.checked) {
    currentPlayer = Math.random() < 0.5 ? "X" : "O";
  } else {
    currentPlayer = "X";
  }

  drawBoard(board, handleClick);
  updateStatus(currentPlayer);

  if (aiToggle.checked && currentPlayer === "O") {
    updateStatus(" Thinking...");
    setTimeout(() => {
      const move = getSmartAIMove([...board]);
      board[move] = "O";
      drawBoard(board, handleClick);

      if (checkWin(board, "O")) {
        winSound.play();
        showWinner(" AI Wins!");
        gameOver = true;
      } else if (checkDraw(board)) {
        drawSound.play();
        showWinner("🤝 It's a Draw!");
        gameOver = true;
      } else {
        currentPlayer = "X";
        updateStatus(currentPlayer);
      }
    }, 600);
  }
}

window.resetGame = resetGame;
resetGame();

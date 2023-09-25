const grid = document.getElementById("grid");
const gridSize = 9;
const numMines = 10;
let mines = [];
let revealedCells = 0;

// Create the Minesweeper grid
function createGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      grid.appendChild(cell);
    }
  }
}

// Randomly place mines on the grid
function placeMines() {
  while (mines.length < numMines) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    if (!mines.some(mine => mine.row === row && mine.col === col)) {
      mines.push({ row, col });
    }
  }
}

// Check if a cell contains a mine
function isMine(row, col) {
  return mines.some(mine => mine.row === row && mine.col === col);
}

// Handle cell click event
function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (isMine(row, col)) {
    cell.classList.add("mine");
    gameOver();
  } else {
    const mineCount = countAdjacentMines(row, col);
    if (mineCount === 0) {
      cell.classList.add("revealed");
      revealEmptyCells(row, col);
    } else {
      cell.textContent = mineCount;
      cell.classList.add("revealed");
    }
    revealedCells++;
    checkWin();
  }
  cell.removeEventListener("click", handleCellClick);
}

// Count the number of adjacent mines
function countAdjacentMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const r = row + i;
      const c = col + j;
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && isMine(r, c)) {
        count++;
      }
    }
  }
  return count;
}

// Recursively reveal empty cells
function revealEmptyCells(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const r = row + i;
      const c = col + j;
      const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      if (cell && !cell.classList.contains("revealed")) {
        const mineCount = countAdjacentMines(r, c);
        if (mineCount === 0) {
          cell.classList.add("revealed");
          revealedCells++;
          revealEmptyCells(r, c);
        } else {
          cell.textContent = mineCount;
          cell.classList.add("revealed");
          revealedCells++;
        }
        cell.removeEventListener("click", handleCellClick);
      }
    }
  }
}

// Game over function
function gameOver() {
  grid.querySelectorAll(".cell").forEach(cell => cell.removeEventListener("click", handleCellClick));
  alert("Game over! You clicked on a mine.");
}

// Check for a win
function checkWin() {
  if (revealedCells === gridSize * gridSize - numMines) {
    grid.querySelectorAll(".cell").forEach(cell => cell.removeEventListener("click", handleCellClick));
    alert("Congratulations! You win!");
  }
}

createGrid();
placeMines();

// Tic-Tac-Toe by Vlad Hadyak

// Create a game board
const cells = document.querySelectorAll(".board-container>div");
let totalCellsFilled = 0;

const gameBoard = (function() {
  const rows = 3;
  const columns = 3;
  const board = [];

  let isPlayerX = true;
  let row, col;

  // Get row-col coordinates of each button clicked
  const render = (e) => {
    const cellIndex = Array.from(cells).indexOf(e.target);                          // Get index of each cell
    row = Math.floor(cellIndex / columns);
    col = cellIndex % columns;

    console.log(`row ${row}, column ${col}`);

    // Track the player's turn 
    if (isPlayerX) { 
      let xBtn = e.target;
      xBtn.classList.add("addXStyle");                                              // Store the values in playerX  
      checkCoordinates.playerX(row, col);           
      xBtn.removeEventListener("click", render);                                    // Disable click event on same btn, after btn has been clicked
    } else {
      let oBtn = e.target;
      oBtn.classList.add("addOStyle");
      checkCoordinates.playerO(row, col);                                           // Store the values in playerO  
      oBtn.removeEventListener("click", render);      
    };

    console.log(board);
    isPlayerX = !isPlayerX;
    totalCellsFilled++;
  };

  cells.forEach(cell => {
    cell.addEventListener('click', render)
  });

  // Create 3x3 array matrix 
  for (i = 0; i < rows; i++) {
    board[i] = []; 
    for (j = 0; j < columns; j++) {
      board[i][j] = [];
    };
  }; 
  
  const getBoard = () => board;
 
  return {getBoard};
})();

// If game ended, disable cells
function disableAllCells() {
  cells.forEach(cell => {
    cell.style.pointerEvents = 'none';
  });
};

// Store player's coordinates
const checkCoordinates = (function() {  
  let playerXPos = [];
  let playerOPos = [];
  let board = gameBoard.getBoard();
 
  const playerX = (row, col) => {
    board[row][col] = "x";                 // for debugging
    playerXPos.push({row, col});   

    const xWon = playRound.isWinner(playerXPos);                                    // Check if playerX is a winner
    if (xWon) {
      console.log("X won");
      disableAllCells();
    };
  };

  const playerO = (row, col) => {
    board[row][col] = "o";                 // for debugging
    playerOPos.push({row, col});

    const oWon = playRound.isWinner(playerOPos);                                    // Check if playerO is a winner
    if (oWon) {
      console.log("O won");
      disableAllCells();
    };
  };

  return {playerOPos, playerXPos, playerX, playerO};
})();

  

const playRound = (function() {
  const isWinner = (player) => {
    const rowCounts = [0, 0, 0];
    const colCounts = [0, 0, 0];
    const diagonalPattern = [
      [[0, 0], [1, 1], [2, 2]],                                                     // Diagonal pattern #1
      [[0, 2], [1, 1], [2, 0]]                                                      // Diagonal pattern #2
    ];   

    player.forEach((obj) => {                                                    
      rowCounts[obj.row]++;          
      colCounts[obj.col]++;
    });

    // Check if entire row or col lines up 
    for (let i = 0; i < 3; i++) {
      if (rowCounts[i] === 3 || colCounts[i] === 3) {                               // End game if condition is met
        cells.forEach((cell, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;

          // Style the matching pattern
          if ((rowCounts[i] === 3 && row === i) || (colCounts[i] === 3 && col === i)) {
            cell.classList.add('match-pattern');
            cell.classList.remove("default-border");                         
          };
        });
        return true;
      };
    };

    // Check if there is a diagonal pattern
    const isDiagonal = diagonalPattern.some(pattern => {
      const match = pattern.every(([row, col]) =>
        player.some(({row: playerRow, col: playerCol}) => row === playerRow && col === playerCol)       // Compare predefined row-col with row-col chosen by player
      );

      if (match) {
        pattern.forEach(([row, col]) => {
          // Linear index formula
          const index = row * 3 + col;                                              // Convert row-col into a single index to identify position of a cell
          cells[index].classList.add('match-pattern');
          cells[index].classList.remove("default-border");
        });
      };
      return match;
    });
    
    if (isDiagonal) {
      console.log(`Diagonal match`);
      return true;
    };

    // Check if there is tie after all 9 cells have been filled up
    if (totalCellsFilled === 8) {
      console.log("tie");
      disableAllCells();
      return;
    };
  };
  return {isWinner};
})();

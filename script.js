// Tic-Tac-Toe by Vlad Hadyak

// Create a game board
const cells = document.querySelectorAll(".board-container>div");
let totalCellsFilled = 0;

const gameBoard = (function() {
  const rows = 3;       //!!
  const columns = 3;    //!!
  const board = [];     //!!
  
  let isPlayerX = true;

  displayPlayerTurn("x"); // X goes first

  // Get row-col coordinates of each button clicked
  const render = (e) => {
    const cellIndex = Array.from(cells).indexOf(e.target);                          // Get index of each cell
    const row = Math.floor(cellIndex / columns);
    const col = cellIndex % columns;
    
    // Track player's turn
    if (isPlayerX) {
      checkCoordinates.playerX(row, col);
      e.target.classList.add("addXStyle");
    } else {
      checkCoordinates.playerO(row, col);
      e.target.classList.add("addOStyle");
    };

    // Remove the click event from the cell that has already been clicked
    e.target.removeEventListener("click", render);

    console.log(`row ${row}, column ${col}`);
    console.log(board);

    isPlayerX = !isPlayerX;                       
    totalCellsFilled++;
  };

  cells.forEach(cell => {
    cell.addEventListener('click', render)
  });

  // Create 3x3 array matrix (FOR DEBUGGING)
  for (i = 0; i < rows; i++) {
    board[i] = []; 
    for (j = 0; j < columns; j++) {
      board[i][j] = [];
    };
  }; 
  
  // For debugging
  const getBoard = () => board;
 
  return {getBoard};
})();

// If game ended, disable cells
function disableAllCells() {
  cells.forEach(cell => {
    cell.style.pointerEvents = 'none';
  });
};

function displayWinner(hasWon) {
  const result = document.querySelector(".result");
  if (hasWon) {
    result.textContent = `Player ${hasWon} won the game!`;
  } else {
    result.textContent = "It's a tie";
  };
};

function displayPlayerTurn(turn) {
  const turnText = document.querySelector(".turn");
  turnText.textContent = turn === "x" ? "Player X's turn" 
                       : turn === "o" ? "Player O's turn" 
                       : "";
};

// Store player's coordinates
const checkCoordinates = (function() {  
  let playerXPos = [];
  let playerOPos = [];
  let board = gameBoard.getBoard();  
  
  const updatePlayerMove = (playerPos, playerMark, nextPlayerTurn, row, col) => {

    // Store coordinates in playerXPos / playerOPos
    playerPos.push({row, col});                                                                  

    const isWinner = playRound.isWinner(playerPos);
    const isTie = playRound.tieGame();

    // If there is a winner ...
    if (isWinner) {             
      console.log(`Player ${playerMark} Won!`);                                                                
      displayPlayerTurn();  
      disableAllCells();
      displayWinner(playerMark);

    // If game is tied ...
    } else if (isTie) {                                                                           
      console.log("TIE");
      displayPlayerTurn();

    // If game still in progress, display who goes next
    } else {                                                                                       
      displayPlayerTurn(nextPlayerTurn);                                                           
    };
  };

   // Get row-col coordinates from gameBoard.render, then pass it through updatePlayerMove()
  const playerX = (row, col) => {
    board[row][col] = "x";   // FOR DEBUGGING
    updatePlayerMove(playerXPos, "X", "o", row, col);                              
  };

  const playerO = (row, col) => {
    board[row][col] = "o";   //FOR DEBUGGING
    updatePlayerMove(playerOPos, "O", "x", row, col);
  };

  return {playerXPos, playerOPos, playerX, playerO};
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
        // Compare predefined row-col with row-col chosen by player
        player.some(({row: playerRow, col: playerCol}) => row === playerRow && col === playerCol)      
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
  };

   // Check if there is tie after all 9 cells have been filled up
  const tieGame = () => {
    if (totalCellsFilled === 8) {
      disableAllCells();
      displayWinner();
      return true;
    };
  };
  return {isWinner, tieGame};
})();

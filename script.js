// Tic-Tac-Toe by Vlad Hadyak

let totalCellsFilled = 0;

const cells = document.querySelectorAll(".board-container>div");
const boardContainer = document.querySelector(".board-container");
const result = document.querySelector(".result");
const startBtn = document.querySelector(".start");
const setupContainer = document.querySelector(".setup-wrapper");

boardContainer.style.display = "none";
result.style.display = "none";

// Allow players to enter their names
const setupGame = (function() {
  const displayUI = () => {
    boardContainer.style.display = "grid";
    result.style.display = "block";
    setupContainer.style.display = "none";
 
    const nameXVal = document.querySelector("#playerX").value;
    const nameOVal = document.querySelector("#playerO").value; 

    displayPlayerTurn("x", nameXVal, nameOVal);                                     // After start game, "X" player goes first
    checkCoordinates.getName(nameXVal, nameOVal);                           
  };

  startBtn.addEventListener("click", displayUI);
})();

// Create a game board
const gameBoard = (function() {
  const rows = 3;       //!!
  const columns = 3;    //!!
  const board = [];     //!!
  
  let isPlayerX = true;

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

// Store player's coordinates
const checkCoordinates = (function() {  
  let playerXPos = [];
  let playerOPos = [];
  let board = gameBoard.getBoard();  
  let playerName1, playerName2;

  const getName = (nameXVal, nameOVal) => {
    playerName1 = nameXVal; 
    playerName2 = nameOVal;
  };

  const updatePlayerMove = (playerPos, winnerName, nextPlayerTurn, row, col) => {
    // Store coordinates in playerXPos / playerOPos
    playerPos.push({row, col});                                                                  

    const isWinner = playRound.isWinner(playerPos);
    const isTie = playRound.tieGame();

    if (isWinner) {             
      console.log(`Player ${winnerName} Won!`);                                                                
      displayPlayerTurn();  
      disableAllCells();
      displayWinner(winnerName);

    } else if (isTie) {                                                                           
      console.log("TIE");
      displayPlayerTurn();
      disableAllCells();
      displayWinner();

    } else {                                                                                       
      displayPlayerTurn(nextPlayerTurn, playerName1, playerName2);     // If game still in progress, display who goes next           
    };
  };

   // Get row-col coordinates from gameBoard.render, then pass it through updatePlayerMove()
  const playerX = (row, col) => {
    board[row][col] = "x";   // FOR DEBUGGING
    updatePlayerMove(playerXPos, playerName1, "o", row, col);                              
  };

  const playerO = (row, col) => {
    board[row][col] = "o";   //FOR DEBUGGING
    updatePlayerMove(playerOPos, playerName2, "x", row, col);
  };

  return {getName, playerXPos, playerOPos, playerX, playerO};
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
    
    if (isDiagonal) return true;
  };

  // Check if there is tie after all 9 cells have been filled up
  const tieGame = () => {
    if (totalCellsFilled === 8) return true;
  };
  return {isWinner, tieGame};
})();

// If game ended, disable cells
function disableAllCells() {
  cells.forEach(cell => {
    cell.style.pointerEvents = "none";
  });
};

function displayWinner(hasWon) {
  if (hasWon) {
    result.textContent = `${hasWon} won the game!`;
  } else {
    result.textContent = "It's a tie";
  };
};

function displayPlayerTurn(turn, playerName1, playerName2) {
  result.textContent = turn === "x" ? `X: ${playerName1}'s turn` 
                       : turn === "o" ? `O: ${playerName2}'s turn` 
                       : "";
};





// Add a play again button after game is finished
// After game is finished, keep track of player's score from previous round
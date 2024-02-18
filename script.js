// Tic-Tac-Toe by Vlad Hadyak

let totalCellsFilled = 0;
let resetClicked = false;

const cells = document.querySelectorAll(".board-container>div");
const boardContainer = document.querySelector(".board-container");
const result = document.querySelector(".result");
const startBtn = document.querySelector(".start");
const setupContainer = document.querySelector(".setup-wrapper");

const scoreDisplay = document.querySelector(".score-wrapper");
const player1Score = document.querySelector(".player1-score");
const drawScore = document.querySelector(".tie-score");
const player2Score = document.querySelector(".player2-score");

const hideUI = (function() {
  scoreDisplay.style.display = "none";
  boardContainer.style.display = "none";
  result.style.display = "none";
})();

// Player names input display
const setupGame = (function() {
  const displayUI = () => {
    const nameXVal = document.querySelector("#playerX").value;
    const nameOVal = document.querySelector("#playerO").value; 

    // If either input values are empty, or same input values, game setup does not proceed
    if (!validateNames(nameXVal, nameOVal)) return;

    scoreDisplay.style.display = "flex";
    boardContainer.style.display = "grid";
    result.style.display = "block";
    setupContainer.style.display = "none";
    
    displayPlayerTurn("x", nameXVal, nameOVal);                                     // After start game, "X" player goes first

    checkCoordinates.getName(nameXVal, nameOVal);       
    updateScore.getName(nameXVal, nameOVal);         
    
    player1Score.textContent = `${nameXVal}: 0`;
    player2Score.textContent = `${nameOVal}: 0`;
    drawScore.textContent = "Tie: 0";
  };

  startBtn.addEventListener("click", displayUI);
})();

// Create a game board
const gameBoard = (function() {
  // Player X always first
  let isPlayerX = true;

  // Get row-col coordinates of each button clicked
  const render = (e) => {
    const cellIndex = Array.from(cells).indexOf(e.target);                          // Get index of each cell
    const row = Math.floor(cellIndex / 3);
    const col = cellIndex % 3;

    // After each round played, "X" always goes first
    if (resetClicked) {
      resetClicked = false;
      isPlayerX = true;
    };

    // Track player's turn
    if (isPlayerX) {
      checkCoordinates.playerX(row, col);
      e.target.classList.add("addXStyle");
      isPlayerX = false;
    } else {
      checkCoordinates.playerO(row, col);
      e.target.classList.add("addOStyle");
      isPlayerX = true;
    };
     
    // Remove the click event from the cell that has already been clicked
    e.target.removeEventListener("click", render);

    console.log(`row ${row}, column ${col}`);
    
    totalCellsFilled++;
  };

  cells.forEach(cell => {
    cell.addEventListener('click', render)
  });

  const addCellClickListener = () => {
    cells.forEach(cell => {
      cell.addEventListener('click', render);
    });
  };
 
  return {addCellClickListener};
})();

// Store player's coordinates
const checkCoordinates = (function() {  
  let playerXPos = [];
  let playerOPos = [];

  let playerName1, playerName2;

  let score1 = 0;
  let score2 = 0;
  let tieScore = 0;

  // !!!!!!!
  const getName = (nameXVal, nameOVal) => {
    playerName1 = nameXVal; 
    playerName2 = nameOVal;
  };

  const updatePlayerMove = (playerPos, winnerName, nextPlayerTurn, row, col) => {
    // Store coordinates in playerXPos / playerOPos
    playerPos.push({row, col});                                                                  

    const isWinner = playRound.isWinner(playerPos);
    const isTie = playRound.tieGame();

    trackScore();

    if (isWinner || isTie) {                                                                          
      disableAllCells();
      displayWinner(isWinner ? winnerName : undefined);  

      if (isTie && !isWinner) {                                                     // Only account for tie if all cells have been filled, and no winner
        tieScore++;
        updateScore.tieScore(tieScore);
      };
      updateScore.gameOverModal();
    } else {                                                                                    
      displayPlayerTurn(nextPlayerTurn, playerName1, playerName2);                  // If game still in progress, display who goes next          
    };
  };

  const trackScore = () => {
    const xWinner = playRound.isWinner(playerXPos);
    const oWinner = playRound.isWinner(playerOPos);

    if (xWinner) {
      score1++;
    } else if (oWinner) {
      score2++;
    };
  };

  // Get row-col coordinates from gameBoard.render, then pass it through updatePlayerMove()
  const playerX = (row, col) => {
    updatePlayerMove(playerXPos, playerName1, "o", row, col);   
    updateScore.playerXScore(score1);
  };

  const playerO = (row, col) => {
    updatePlayerMove(playerOPos, playerName2, "x", row, col);
    updateScore.playerOScore(score2);
  };

  const resetCoordinates = () => {
    playerXPos = [];
    playerOPos = [];
    totalCellsFilled = 0;
  };

  return {getName, playerXPos, playerOPos, playerX, playerO, resetCoordinates};
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

const updateScore = (function() {
  const dialog = document.querySelector("dialog");
  const playAgain = document.querySelector(".play-again-btn");

  let player1, player2;

  const getName = (nameXVal, nameOVal) => {
    player1 = nameXVal;
    player2 = nameOVal;
  };

  const gameOverModal = () => {
    dialog.showModal();
  };

  const resetGame = () => {
    removeData();
    dialog.close();
    displayPlayerTurn("x", player1, player2);
    resetClicked = true;
  };

  const playerXScore = (xScore) => {
    player1Score.textContent = `${player1}: ${xScore}`;
  };

  const playerOScore = (oScore) => {
    player2Score.textContent = `${player2}: ${oScore}`
  };

  const tieScore = (tieScore) => {
    drawScore.textContent = `Tie: ${tieScore}`;
  };

  playAgain.addEventListener("click", resetGame);

  return {gameOverModal, resetGame, getName, playerXScore, playerOScore, tieScore};
})();

function removeData() {
  cells.forEach(cell => {
    cell.style.pointerEvents = "auto";
    cell.classList.remove("addXStyle");
    cell.classList.remove("addOStyle");
    cell.classList.replace("match-pattern", "default-border");
  });
  gameBoard.addCellClickListener();                                                 // Reenable all cells after each new round
  checkCoordinates.resetCoordinates(); 
};

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

function validateNames(nameXVal, nameOVal) {
  const errorMsgX = document.querySelector(".x .error-text");
  const errorMsgO = document.querySelector(".o .error-text");
  const xInput = document.querySelector("input[type='text']#playerX");
  const oInput = document.querySelector("input[type='text']#playerO");

  // trim() to remove white-space
  const trimmedNameXVal = nameXVal.trim();
  const trimmedNameOVal = nameOVal.trim();

  if (!trimmedNameXVal || !trimmedNameOVal) {
    if (!trimmedNameXVal) {
      showErrorMessage(errorMsgX, xInput, "Please enter a name");
    };
    if (!trimmedNameOVal) {
      showErrorMessage(errorMsgO, oInput, "Please enter a name");
    };
    return false;
  };

  // If player names are the same
  if (trimmedNameXVal === trimmedNameOVal) {
    showErrorMessage(errorMsgX, xInput, "Player names must be different");
    showErrorMessage(errorMsgO, oInput, "Player names must be different");
    return false;
  };

  return true;
};

function showErrorMessage (errorMsg, inputElement, msg) {
  errorMsg.style.visibility = "visible";
  errorMsg.textContent = msg;
  inputElement.classList.add("invalid-input-style");
};



// After game is finished, keep track of player's score from previous round
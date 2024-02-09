// Tic-Tac-Toe by Vlad Hadyak

// Create a game board
const gameBoard = (function() {
  const rows = 3;
  const columns = 3;
  const board = [];
  const cells = document.querySelectorAll(".board-container>div");
  let row, col;

  // Get row-col coordinates of each button clicked
  const render = (e) => {
    const cellIndex = Array.from(cells).indexOf(e.target);
    row = Math.floor(cellIndex / columns);
    col = cellIndex % columns;
    console.log(`row ${row}, column ${col}`);

    // Store the values in playerX and playerO
    checkCoordinates.playerX(row, col);             
    checkCoordinates.playerO(row, col);    
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



// Check for duplicates
const checkCoordinates = (function() {
  let playerXPos = [];
  let playerOPos = [];
  let board = gameBoard.getBoard();

  const playerX = (row, col) => {
    board[row][col] = "x";                      // Replace x with text content of the current button clicked
    playerXPos.push({row, col});   
    //console.log({row, col});
    //console.log(playerXPos);
    console.log(board);
  };
  // Make sure X and O take turns
  const playerO = (row, col) => {
    board[row][col] = "o";   
    playerOPos.push({row, col});
  };

  const checkXOMatches = () => {
    // If x match o and vice versa
    for (let i = 0; i < playerXPos.length; i++) {
      const xObj = playerXPos[i];

      for (let j = 0; j < playerOPos.length; j++) {
        const oObj = playerOPos[j];

        if (xObj.row === oObj.row && xObj.col === oObj.col) {
          return true;
        };
      };
    };
    return false;
  };

   // Check for o-o and x-x matches
   const checkDuplicates = (positions) => {        // an array of objects for playerXPos / playerOPos
    positions.sort((a, b) => {                    // compare one object with another of the same mark, and sort it
      if (a.row !== b.row) {
        return a.row - b.row;
      } else {
        return a.col - b.col;
      };
    });

    for (let i = 0; i < positions.length - 1; i++) {
      if (positions[i].row === positions[i + 1].row && 
          positions[i].col === positions[i + 1].col) {
        return true;
      };
    };
    return false;
  };

  return {checkXOMatches, checkDuplicates, playerOPos, playerXPos, playerX, playerO};
})();

  

const playRound = (function() {
  let playerXPos = checkCoordinates.playerXPos;
  let playerOPos = checkCoordinates.playerOPos;            
  let isXOMatch = checkCoordinates.checkXOMatches();       

  const isWinner = (player) => {
    let isDuplicate = checkCoordinates.checkDuplicates(player);                     // Check if a player has a duplicate mark

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

    // check if entire row or col line up 
    for (let i = 0; i < 3; i++) {
      if ((rowCounts[i] === 3 || colCounts[i] === 3) && isDuplicate === false) {
        return true;
      };
    };

    // check if diagonally line up
    const isDiagonal = diagonalPattern.some(diagonalPattern => {                      
      return player.every((obj, index) => {              
        return obj.row === diagonalPattern[index][0] && obj.col === diagonalPattern[index][1];             // Compare against predefined array 
      });
    });

    if (isDiagonal && !isDuplicate && !isXOMatch) {
      //console.log("diagonally match / no duplicates");
      return true;
    };

    if (isDuplicate) {
      //console.log("duplicate");
    };

    if (isXOMatch) {
      //console.log("xo match");
    };
  };

  if (isWinner(playerXPos)) {
    //console.log(`X is a winner`);
    // End game
  };
  if (isWinner(playerOPos)) {
    //console.log(`O is a winner`);
  };

  return {isWinner};
})();

console.log(gameBoard.getBoard());    // Return updated board



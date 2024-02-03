// Tic-Tac-Toe by Vlad Hadyak

// Create a game board
const gameBoard = (function() {
  const rows = 3;
  const columns = 3;
  const board = [];

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

  const playerX = (row, col, mark) => {
    board[row][col] = mark;
    playerXPos.push({row, col});
  };

  const playerO = (row, col, mark) => {
    board[row][col] = mark;
    playerOPos.push({row, col});
  };

  const checkXOMatches = () => {
    // If x match o and vice versa
    for (let i = 0; i < playerXPos.length; i++) {
      const xObj = playerXPos[i];

      for (let j = 0; j < playerOPos.length; j++) {
        const oObj = playerOPos[j];

        if (xObj.row === oObj.row && xObj.col === oObj.col) {
          console.log("x match o");
        };
      };
    };
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

  // If x match x
  if (checkDuplicates(playerXPos)) {
    console.log("x match x");   
  };
  // If o match o
  if (checkDuplicates(playerOPos)) {
    console.log("o match o");
  };

  return {playerX, playerO, checkXOMatches, checkDuplicates, playerOPos, playerXPos};
})();

checkCoordinates.playerX(0, 0, "x");
checkCoordinates.playerO(1, 0, "o");
checkCoordinates.playerX(1, 1, "x");
checkCoordinates.playerO(0, 1, "o");
checkCoordinates.playerX(2, 2, "x");
checkCoordinates.playerO(2, 1, "o");
checkCoordinates.checkXOMatches();   


const playRound = (function() {

  let playerXPos = checkCoordinates.playerXPos;
  let playerOPos = checkCoordinates.playerOPos;                                    
  let isDuplicate = checkCoordinates.checkDuplicates(playerXPos);                   // Check if a player has a duplicate mark

  // insert checkXOMatches

  const isWinner = (player) => {
    const rowCounts = [0, 0, 0];
    const colCounts = [0, 0, 0];
    const diagonalPattern = [[[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];   // top left to bottom right, top right to bottom left

    player.forEach((obj) => {
      rowCounts[obj.row]++;
      colCounts[obj.col]++;
    });


    // check if diagonally line up
    const isDiagonal = diagonalPattern.some(diagonalPattern => {
      return player.every((obj, index) => {
        return obj.row === diagonalPattern[index][0] && obj.col === diagonalPattern[index][1];
      });
    });

    if (isDiagonal && isDuplicate === false) {
      console.log("diagonally match");
      return true;
    };
  
    // check if entire row or col line up 
    for (let i = 0; i < 3; i++) {
      if ((rowCounts[i] === 3 || colCounts[i] === 3) && isDuplicate === false) {
        return true;
      };
    };
  };

  if (isWinner(playerXPos)) {
    console.log(`X is a winner`);
  };
  if (isWinner(playerOPos)) {
    console.log(`O is a winner`);
  };

  return {isWinner};
})();

console.log(gameBoard.getBoard());    // Return updated board



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

  const matchCondition = () => {
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
  };

  return {playerX, playerO, matchCondition};
})();

checkCoordinates.playerX(2, 0, "x");
checkCoordinates.playerO(2, 2, "o");
checkCoordinates.playerX(2, 0, "x");
checkCoordinates.playerX(2, 2, "x");
checkCoordinates.playerO(2, 1, "o");
checkCoordinates.matchCondition();    

console.log(gameBoard.getBoard());    // Return updated board
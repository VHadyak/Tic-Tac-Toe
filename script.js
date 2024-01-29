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

  const getBoard = () => {
    return board;
  };

  return {getBoard};
})();


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
    for (let i = 0; i < playerXPos.length; i++) {
      const xPos = playerXPos[i];
      console.log(xPos);    // get all possible values entered by x, and check if any rows and cols match with other instances


      for (let j = 0; j < playerOPos.length; j++) {
        const oPos = playerOPos[j];
        if ((xPos.row === oPos.row && xPos.col === oPos.col)) {
          console.log("matched");
        };
      };
    };
  };

  return {playerX, playerO, matchCondition};
})();

checkCoordinates.playerX(1, 2, "x");
checkCoordinates.playerO(0, 2, "o");
checkCoordinates.playerX(1, 1, "x");
checkCoordinates.playerX(0, 2, "x");
checkCoordinates.playerO(1, 0, "o");
checkCoordinates.matchCondition();

console.log(gameBoard.getBoard());    // Return updated board
// Tic-Tac-Toe by Vlad Hadyak

// Player template
const player = function(mark, rowPos, colPos) {
  const getPlayerMark = () => {
    return mark;
  }
  return {getPlayerMark, rowPos, colPos};
};

const playerX = player("x", 0, 1);
const playerO = player("0", 1, 0);





// Create a game board
const gameBoard = (function() {
  const rows = 3;
  const columns = 3;
  const board = []

  // Create 3x3 array matrix
  for (i = 0; i < rows; i++) {
    board[i] = []; 
    for (j = 0; j < columns; j++) {
      board[i][j] = [];
    };
  }; 



  // Get index position of the player's mark
  function extractValues({rowPos, colPos, getPlayerMark}) {               //Destructuring
    board[rowPos][colPos] = getPlayerMark();
  };
  
  extractValues(playerX);
  extractValues(playerO);





  const getBoard = () => board;

  return {getBoard}
})();

console.log(gameBoard.getBoard());

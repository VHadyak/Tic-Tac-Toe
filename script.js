// Tic-Tac-Toe by Vlad Hadyak

// Create a game board
const gameBoard = (function() {
  const cells = document.querySelectorAll(".board-container>div");
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
    board[row][col] = "x";                     
    playerXPos.push({row, col});   
    playRound.isWinner(playerXPos);                                                 // Check if playerX is a winner
  };
  // Make sure X and O take turns
  const playerO = (row, col) => {
    board[row][col] = "o";   
    playerOPos.push({row, col});
    playRound.isWinner(playerOPos);                                                 // Check if playerO is a winner
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

    // Check if entire row or col line up 
    for (let i = 0; i < 3; i++) {
      if ((rowCounts[i] === 3 || colCounts[i] === 3)) {
        console.log("WIN");
        return true;
      };
    };

    // Check if there is a diagonal pattern
    const isDiagonal = diagonalPattern.some(pattern => {
      return pattern.every(([row, col]) => player.some(({row: r, col: c}) => row === r && col === c));
    });

    if (isDiagonal) {
      console.log("Diagonal match");      
    };
  };
  return {isWinner};
})();


console.log(gameBoard.getBoard());    // Return updated board
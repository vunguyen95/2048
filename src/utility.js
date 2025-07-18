//Utility functions ('global')
//Note: this function is declared as const so arrow expression,
//otherwise, const in.. = function (){}
export const initializeBoard = () => {
    const newBoard = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
    return newBoard;
  };

  //Automatically pass board by reference.
  // Originally, the board is mutated, try to have a pure function.
export const addRandomTile = (board) => {
    let newBoard = board.map(row => [...row]);
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
        if (newBoard[r][c] === 0) {
            emptyCells.push({ r, c });
        }
        }
    }

  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
  }
  return newBoard;
};
// Until the board is full, the game is not over.
export  const checkGameOver = (board) => {
    return board.every(row => row.every(cell => cell != 0));
  };
  
export  const deepCopyBoard = (board) => JSON.parse(JSON.stringify(board));
  
  const slide = (arr) => {
    let filteredArr = arr.filter((value) => value != 0);
    return filteredArr;
  };
export const transposeBoard = (currentBoard) => {
    let transposed = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            transposed[c][r] = currentBoard[r][c];
        }
    }
    return transposed;
}; 
export  const mergeRD = (arr, score) => {
    let processedArr = arr.filter((value) => value != 0);
    let idx = processedArr.length - 1;
    while (idx > 0) {
      if (processedArr[idx] == processedArr[idx - 1]) {
        processedArr[idx] *= 2;
        score += processedArr[idx];
        processedArr.splice(idx - 1, 1);
        idx -= 1;
      }
      idx -= 1;
    }
    while (processedArr.length < 4) {
      processedArr.unshift(0); //padding zeroes.
    }
    return {processedArr, score};
  };
  export default {
    initializeBoard,
    addRandomTile,
    checkGameOver,
    deepCopyBoard,
    mergeRD,
    transposeBoard,
  };
  
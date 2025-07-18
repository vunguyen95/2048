import { useState, useEffect, useCallback } from 'react'
import './App.css'
import utils from "./utility.js";

/* ----------Tile component----------*/
function Tile({ value }) {
  return <div className={"tile"}>{value}</div>;
}

/* ----------Grid component----------*/
function Grid({ board, onMove }) {
  /* useEffect() hook to listen to event, and remove the event listener when the component is unmounted. Technically, it's not necessary, but it's a good practice.
  If I dont use useEffect(), the event listener will be added every time the component is rendered, which is not efficient.
  I will then have to attach a function like keydown() to Grid component, make it focusable with tabIndex */
  useEffect(() => {
    const handleKey = (event) => {
      let direction = null;
      //console.log("Key Pressed:", event.key);
      switch (event.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
        default:
          return;
      }
      event.preventDefault();
      if (direction) {
        onMove(direction);
      }
    };

    window.addEventListener("keydown", handleKey);
    //REMEMBER TO REMOVE THE EVENT LISTENER WHEN THE COMPONENT IS UNMOUNTED
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [onMove]);
  return (
    // Use the custom class for the grid container
    <div className="game-grid-container">
      {board.map((row, rowIndex) =>
        row.map((tileValue, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={tileValue} />
        ))
      )}
    </div>
  );
}

/* ----------Game component----------*/
export default function Game() {
  const [board, setBoard] = useState(utils.initializeBoard); 
  const [score, setScore] = useState(0); 
  const [gameOver, setGameOver] = useState(false); 

  useEffect(() => {
    const initialBoard = utils.initializeBoard();
    // Manually place some tiles for initial testing display, actually, may be include addRandomTile() inside initializeBoard() and remove this.
    /*initialBoard[0][0] = 2;
    initialBoard[0][1] = 2;
    initialBoard[1][2] = 8;
    initialBoard[2][3] = 16;*/

    //randomly place 2 tiles on the board
    utils.addRandomTile(initialBoard);
    utils.addRandomTile(initialBoard);
    setBoard(initialBoard);
  }, []);

  //Core logic handling.
  const handleMove = useCallback(
    (direction) => {  
      if (utils.checkGameOver(board)){
        window.alert("Meh, you get " + score + " points");
        return;
      };
      // deep copy because of arr object, but too slow?
      //let newBoard = utils.deepCopyBoard(board);
      let newBoard = board.map(row => [...row]);
      let newScore = score;
      let boardChanged = false;

      console.time('move')
      // If the direction is right or left, we keep the board as is.
      // if the direction is up or down, we need to transpose the board first.
      if (direction === "up" || direction === "down") {
        //console.log("Before transpose:", JSON.stringify(newBoard));
        newBoard = utils.transposeBoard(newBoard);
        //console.log("After transpose:", JSON.stringify(newBoard));
      }

      // moving logic
      // Note that moving right is the same as moving down (transpose), and moving left is the same as moving up (transpose). 
      //console.time('merge')
      for (let r = 0; r < 4; r++){
        let originalRow = [...newBoard[r]];
        let processedArr;
        
        if (direction === "left" || direction === "up"){
          originalRow = [...originalRow].reverse();
          
        }
        const result = utils.mergeRD(originalRow, newScore);
        processedArr = result.processedArr;
        newScore = result.score;
        //console.log("After merge:", JSON.stringify(processedArr));
        if (direction === "left" || direction === "up"){
          processedArr = [...processedArr].reverse();
        }
        
        //this is freaking important, we need to compare the original row with the processed row, not the new board. otherwise, the boardChanged will be false.
        //it also messed up with the state update, showing the wrong board.
        // Even though the function looks ``correct'', React has its own way of handling the state update (so confusing)
        if (JSON.stringify(newBoard[r]) !== JSON.stringify(processedArr)) {
          boardChanged = true;
        }
        newBoard[r] = processedArr;
        
      }
      //console.timeEnd('merge')
      if (direction === "up" || direction === "down"){
        newBoard = utils.transposeBoard(newBoard);
      }
      
      if (boardChanged) {
        let updatedBoard = utils.addRandomTile(newBoard)
        setBoard(updatedBoard);
        setScore(newScore);

        if (utils.checkGameOver(newBoard)) {
          setGameOver(true);
          window.alert("Game Over! Your score: " + newScore);
        }
      }
      console.timeEnd('move')
    },
    [board, score, gameOver]
  );

  //restart function
  const handleRestart = () => {
    let freshBoard = utils.initializeBoard();
    /* add random titles */
    utils.addRandomTile(freshBoard);
    utils.addRandomTile(freshBoard);
    setBoard(freshBoard);
    setScore(0);
    setGameOver(false);
    
  };
  return (
    <div className="game-container">
      <h1 className="title">2048 with React </h1>

      <div className="game-card">
        <div className="status">{score}</div>

        <Grid board={board} onMove={handleMove} />

        <button onClick={handleRestart} className="button">
          Restart Game
        </button>
      </div>
    </div>
  );
}




const playerFactory = (name, mark) => {

  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
}

const gameBoard = (() => {
  let gameboard = [["", "", ""], ["", "", ""], ["", "", ""]];
  const clearGameBoard = () => {
    gameboard = [["", "", ""], ["", "", ""], ["", "", ""]];
  }

  const getSquare = (position) => {
    return gameboard[position[0]][position[1]]
  }
  const setSquare = (position, mark) => {
    gameboard[position[0]][position[1]] = mark
  }

  const getState = () => gameState;

  function getRows(){
    rows = []
    for(row of gameboard){
      rows.push(row)
    }
  return rows
  }

  function getColumns(){
    let columns = []
    for (let i = 0; i < 3; i++){
      let column = []
      for (let j = 0; j < 3; j++){
        column.push(gameboard[j][i])
      }
      columns.push(column)
    }
    return columns;
  }

  function getDiagonals(){
    let firstDiagonal = []
    let secondDiagonal = []
    for (let i = 0; i < 3; i++){
      firstDiagonal.push(gameboard[i][i])
      for (let j = 0; j < 3; j++){
        if(j == 2 - i){
          secondDiagonal.push(gameboard[i][j])
        }
      }

    }
    return [firstDiagonal, secondDiagonal];
  }


  const isOver = () => {
    let winningPositions = ["X,X,X", "O,O,O"]
    let position = [getDiagonals(), getColumns(), getRows()].flat()
    return position.some(array => winningPositions.includes(array.join(",")))
  }

  const isAllMarksPlaced = () => {
    return !gameboard.flat().includes("")
  }

  const getGameBoard = () => {
    return gameboard
  }


  return {
    getSquare,
    getGameBoard,
    clearGameBoard,
    setSquare,
    isOver,
    isAllMarksPlaced
  };

})()

const game = (() => {
  let player1 = playerFactory("Testowy", "X");
  let player2 = playerFactory("Testowy2", "O");
  let current_player = player1
  let gameState = "Playing"

  //DOM Cache
  let squares = Array.from(document.querySelectorAll(".gameboard-square"));
  //let startButton = document.querySelector("#start-btn")
  let resetButton = document.querySelector("#reset-btn");
  let matchUpDiv = document.querySelector(".players-div h2");
  let currentMoveDiv = document.querySelector("#move-para");
  let resultDiv = document.querySelector("#result-para");
  let changeOptionButton = document.querySelector("#change-option-btn");

  //bind events
  for(square of squares){
    square.addEventListener("click", setMark)
  }
  //startButton.addEventListener("click", startGame)
  resetButton.addEventListener("click", restartGame)
  changeOptionButton.addEventListener("click", bringOptions)

  function startGame(){
    gameState = "Playing";
  }

  function restartGame(){
    gameState = "Playing";
    gameBoard.clearGameBoard();
    render()
  }

  function bringOptions(){
    let gameDiv = document.querySelector(".game-div");
    let gameOptionsDiv = document.querySelector(".game-form");
    gameDiv.classList.toggle("hidden-right");
    setTimeout(function(){gameOptionsDiv.classList.toggle("visible-left")}, 500);
  }

  //switches current player
  function switchCurrentPlayer(player){
    current_player == player1 ? current_player = player2 : current_player = player1
  }

  //Adds mark of current player to the gameboard
  function setMark(event){
    if (gameState != "Playing") return

    let squarePosition = Array.from(event.target.getAttribute("data-position"));
    if(gameBoard.getSquare(squarePosition)== ""){
      gameBoard.setSquare(squarePosition, current_player.getMark())
      switchCurrentPlayer(current_player)
    }
    render()
  }

  function setInterface(){
    matchUpDiv.textContent = `${player1.getName()} ${player1.getMark()} vs ${player2.getName()} ${player2.getMark()}`
    currentMoveDiv.textContent = `${current_player.getMark()}`
  }

  function displayResult(){
    if (gameState == "Tie"){
      resultDiv.textContent = "It's a Tie. Try Again!"
    }
    else if (gameState == "Finished"){
      current_player == player1 ? resultDiv.textContent = `The winner is ${player2.getName()}` : resultDiv.textContent = `The winner is ${player1.getName()}`
    }
  }

  function checkGameState(){
    if (gameBoard.isOver()){
      gameState = "Finished"
      return true
    }
    else if(gameBoard.isAllMarksPlaced()){
      gameState = "Tie"
      return true
    }
  }
  //renders gameboard on a screen
  function render(){
    setInterface();
    if(checkGameState()){
      displayResult()
    };
    let i = 0
    for(row of gameBoard.getGameBoard()){
      for(col of row){
        squares[i].textContent = col
        i += 1
      }
    }

  }
})()

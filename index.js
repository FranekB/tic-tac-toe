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
  let player1;
  let player2;
  let currentPlayer;
  let gameState = "Playing"

  //DOM Cache
  let squares = Array.from(document.querySelectorAll(".gameboard-square"));
  //let startButton = document.querySelector("#start-btn")
  let resetButton = document.querySelector(".reset-btn-js");
  let matchUpDiv = document.querySelector(".matchup-js");
  let currentMoveDiv = document.querySelector("#current-move-js");
  let resultDiv = document.querySelector("#game-result-js");
  let changeOptionButton = document.querySelector("#change-options-js");
  let gameDiv = document.querySelector(".game-js");
  let gameOptionsDiv = document.querySelector(".options-opponent-js");
  let chooseButtons = document.querySelectorAll(".choose-opponent-js");
  let formDiv = document.querySelector(".game-options-js");
  let startButton = document.querySelector(".start-btn-js");
  let inputs = document.querySelectorAll(".player-input-js");
  let markDivs = document.querySelectorAll(".mark-div-js");
  let hiddenDiv = document.querySelector(".hidden")
  //bind events
  for(const square of squares){
    square.addEventListener("click", setMark)
  }
  for(const button of chooseButtons){
    button.addEventListener("click", bringForm);
  }
  resetButton.addEventListener("click", restartGame)
  changeOptionButton.addEventListener("click", bringOptions)
  startButton.addEventListener("click", startGame)

  for (mark of markDivs){
    mark.addEventListener("click", switchMarks);
  }

  function startGame(){
    let marksImg = document.querySelectorAll(".mark-img-js");
    let player1Name = inputs[0].value || "Player 1";
    let player2Name = inputs[1].value || "Player 2";
    player1 = playerFactory(player1Name, marksImg[0].getAttribute("alt"))
    player2 = playerFactory(player2Name, marksImg[1].getAttribute("alt"))
    player1.getMark() === "X" ? currentPlayer = player1 : currentPlayer = player2;
    hiddenDiv.style.width = "0%";

    function turnOffInterface(){
      formDiv.classList.toggle("visible-bottom");
      gameOptionsDiv.classList.toggle("visible-left");
      gameDiv.classList.toggle("hidden-right");
    }

    gameState = "Playing";
    turnOffInterface();
    setInterface();
    restartGame();
    render();

  }

  function restartGame(){
    gameState = "Playing";
    gameBoard.clearGameBoard();
    render()
  }

  function bringForm(){
    formDiv.classList.toggle("visible-bottom");
    hiddenDiv.style.width = "30%";
  }

  function bringOptions(){
    gameDiv.classList.toggle("hidden-right");
    setTimeout(function(){gameOptionsDiv.classList.toggle("visible-left")}, 400);
  }


  //switches current player
  function switchCurrentPlayer(player){
    currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1
  }

  //Adds mark of current player to the gameboard
  function setMark(event){
    if (gameState != "Playing") return

    let squarePosition = Array.from(event.target.getAttribute("data-position"));
    if(gameBoard.getSquare(squarePosition)== ""){
      gameBoard.setSquare(squarePosition, currentPlayer.getMark())
    }
    switchCurrentPlayer()
    render()
  }

  function switchMarks(){
    let tempDiv = markDivs[0].innerHTML;
    markDivs[0].innerHTML = markDivs[1].innerHTML;
    markDivs[1].innerHTML = tempDiv;
    markDivs[0].lastElementChild.textContent = "Player 1";
    markDivs[1].lastElementChild.textContent = "Player 2";
  }
  function setInterface(){
    matchUpDiv.textContent = `${player1.getName()} ${player1.getMark()} vs ${player2.getName()} ${player2.getMark()}`
    currentMoveDiv.textContent = `${currentPlayer.getName()}`
  }

  function displayResult(){
    if (gameState == "Tie"){
      resultDiv.textContent = "It's a Tie. Try Again!"
    }
    else if (gameState == "Finished"){
      currentPlayer == player1 ? resultDiv.textContent = `The winner is ${player2.getName()}` : resultDiv.textContent = `The winner is ${player1.getName()}`
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

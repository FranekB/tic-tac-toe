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
    const winningPositions = ["X,X,X", "O,O,O"]
    const position = [getDiagonals(), getColumns(), getRows()].flat()
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
  let gameState;

  //DOM Cache
  const matchupHeader = document.querySelector(".matchup-js");
  const boardSquares = Array.from(document.querySelectorAll(".gameboard-square"));
  const gameDiv = document.querySelector(".game-js");

  const currentPlayerDiv = document.querySelector("#current-move-js");
  const gameResultDiv = document.querySelector("#game-result-js");
  const resetButton = document.querySelector(".reset-btn-js");
  const changeOptionsButton = document.querySelector("#change-options-js");

  const leftOptionsWrapper = document.querySelector(".wrapper-hidden");
  const opponentChoiceDiv = document.querySelector(".options-opponent-js");
  const chooseOpponentButtons = document.querySelectorAll(".choose-opponent-js");
  const gameOptionsDiv = document.querySelector(".game-options-js");
  const bottomOptionsWrapper = document.querySelector(".hidden");
  const playerNameInputs = document.querySelectorAll(".player-input-js");
  const playerMarkDivs = document.querySelectorAll(".mark-div-js");
  const startGameButton = document.querySelector(".start-btn-js");

  //BIND EVENTS
  for(const square of boardSquares){
    square.addEventListener("click", placeMarkOnGameBoard)
  }
  for(const button of chooseOpponentButtons){
    button.addEventListener("click", showBottomOptions);
  }
  resetButton.addEventListener("click", restartGame)
  changeOptionsButton.addEventListener("click", showLeftOptions)
  startGameButton.addEventListener("click", startGame)

  for (mark of playerMarkDivs){
    mark.addEventListener("click", changePlayersMarks);
  }

  function createPlayers(){
    const marksImg = document.querySelectorAll(".mark-img-js");
    const player1Name = playerNameInputs[0].value || "Player 1";
    const player2Name = playerNameInputs[1].value || "Player 2";
    player1 = playerFactory(player1Name, marksImg[0].getAttribute("alt"))
    player2 = playerFactory(player2Name, marksImg[1].getAttribute("alt"))
  }

  function startGame(){
    createPlayers()
    player1.getMark() === "X" ? currentPlayer = player1 : currentPlayer = player2;
    gameState = "Playing";

    //Hide forms
    setTimeout(function(){bottomOptionsWrapper.style.width = "0%";}, 500);
    setTimeout(function(){leftOptionsWrapper.style.width = "0%";}, 1000);
    hideOptions();
    addNamesToInterface();
    restartGame();

    function hideOptions(){
      gameOptionsDiv.classList.toggle("visible-bottom");
      opponentChoiceDiv.classList.toggle("visible-left");
      gameDiv.classList.toggle("hidden-right");
    }
  }

  function addNamesToInterface(){
    matchupHeader.textContent = `${player1.getName()} ${player1.getMark()} vs ${player2.getName()} ${player2.getMark()}`
    currentPlayerDiv.textContent = `${currentPlayer.getName()}`
  }

  function restartGame(){
    gameState = "Playing";
    gameBoard.clearGameBoard();
    render()
  }

  function showBottomOptions(){
    gameOptionsDiv.classList.toggle("visible-bottom");
    bottomOptionsWrapper.style.width = "30%";
  }

  function showLeftOptions(){
    gameDiv.classList.toggle("hidden-right");
    setTimeout(function(){opponentChoiceDiv.classList.toggle("visible-left")}, 400);
    leftOptionsWrapper.style.width = "100%"
  }


  //switches current player
  function switchCurrentPlayer(player){
    currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1
  }

  //Adds mark of current player to the gameboard
  function placeMarkOnGameBoard(event){
    if (gameState != "Playing") return

    const squarePosition = Array.from(event.target.getAttribute("data-position"));
    if(gameBoard.getSquare(squarePosition) == ""){
      gameBoard.setSquare(squarePosition, currentPlayer.getMark())
    }
    switchCurrentPlayer()
    render()
  }

  function changePlayersMarks(){
    const tempDiv = playerMarkDivs[0].innerHTML;
    playerMarkDivs[0].innerHTML = playerMarkDivs[1].innerHTML;
    playerMarkDivs[1].innerHTML = tempDiv;
    playerMarkDivs[0].lastElementChild.textContent = "Player 1";
    playerMarkDivs[1].lastElementChild.textContent = "Player 2";
  }

  function showGameResult(){
    if (gameState == "Tie"){
      gameResultDiv.textContent = "It's a Tie. Try Again!"
    }
    else if (gameState == "Finished"){
      currentPlayer == player1 ? gameResultDiv.textContent = `The winner is ${player2.getName()}` : gameResultDiv.textContent = `The winner is ${player1.getName()}`
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
    addNamesToInterface();
    if(checkGameState()){
      showGameResult()
    };
    let i = 0
    for(row of gameBoard.getGameBoard()){
      for(col of row){
        boardSquares[i].textContent = col
        i += 1
      }
    }
  }
})()

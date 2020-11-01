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

  const publicAPI = {
      getSquare,
      getGameBoard,
      clearGameBoard,
      setSquare,
      isOver,
      isAllMarksPlaced
    };

  return publicAPI
})()


const game = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let gameState;

  //DOM Cache
  const resetButton = document.querySelector(".reset-btn-js");
  const startGameButton = document.querySelector(".start-btn-js");
  const boardSquares = Array.from(document.querySelectorAll(".gameboard-square"));
  const playerNameInputs = document.querySelectorAll(".player-input-js");

  //BIND EVENTS
  for(const square of boardSquares){
    square.addEventListener("click", placeMarkOnGameBoard)
  }

  resetButton.addEventListener("click", restartGame)
  startGameButton.addEventListener("click", startGame)


  function createPlayers(){
    const marksImg = document.querySelectorAll(".mark-img-js");
    const player1Name = playerNameInputs[0].value || "Player 1";
    const player2Name = playerNameInputs[1].value || "Player 2";
    player1 = playerFactory(player1Name, marksImg[0].getAttribute("alt"))
    player2 = playerFactory(player2Name, marksImg[1].getAttribute("alt"))
  }

  function startGame(){
    createPlayers()
    currentPlayer = player1;
    gameState = "Playing";

    //Hide forms
    displayController.hideForms()
    restartGame();
    displayController.addNamesToInterface(player1, player2);
  }

  function restartGame(){
    gameState = "Playing";
    currentPlayer = player1;
    gameBoard.clearGameBoard();
    displayController.clearResults()
    displayController.addCurrentMoveText(currentPlayer);
    render()
  }


  //switches current player
  function switchCurrentPlayer(player){
    if (gameState != "Playing") return;
    currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1
  }

  //Adds mark of current player to the gameboard
  function placeMarkOnGameBoard(event){
    if (gameState != "Playing") return

    const squarePosition = Array.from(event.target.getAttribute("data-position"));
    if(gameBoard.getSquare(squarePosition) == ""){
      gameBoard.setSquare(squarePosition, currentPlayer.getMark())
    }
    render()
    switchCurrentPlayer()
    displayController.addCurrentMoveText(currentPlayer);
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
    if(checkGameState()){
      displayController.showGameResult(gameState, currentPlayer)
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


const displayController = (() => {

  //Store DOM
  const leftOptionsWrapper = document.querySelector(".wrapper-hidden");
  const bottomOptionsWrapper = document.querySelector(".hidden");
  const gameDiv = document.querySelector(".game-js");
  const opponentChoiceDiv = document.querySelector(".options-opponent-js");
  const gameOptionsDiv = document.querySelector(".game-options-js");
  const chooseOpponentButtons = document.querySelectorAll(".choose-opponent-js");
  const changeOptionsButton = document.querySelector("#change-options-js");
  const gameResultDiv = document.querySelector("#game-result-js");
  const currentPlayerDiv = document.querySelector("#current-move-js");
  const matchupDivs = document.querySelectorAll(".matchup-mark-js")
  const matchupHeader = document.querySelector(".matchup-js");
  const playerMarkDivs = document.querySelectorAll(".mark-div-js");

  //Bind Events

  for(const button of chooseOpponentButtons){
    button.addEventListener("click", showBottomOptions);
  }
  changeOptionsButton.addEventListener("click", showLeftOptions)

  for (mark of playerMarkDivs){
    mark.addEventListener("click", changePlayersMarks);
  }

  const hideForms = () =>{
    setTimeout(function(){bottomOptionsWrapper.style.width = "0%";}, 500);
    setTimeout(function(){leftOptionsWrapper.style.width = "0%";}, 1000);
    gameOptionsDiv.classList.toggle("visible-bottom");
    opponentChoiceDiv.classList.toggle("visible-left");
    gameDiv.classList.toggle("hidden-right");
  }

  const clearResults = () => {
    gameResultDiv.classList.remove("visible-game-result")
    gameResultDiv.textContent = "";
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

  function changePlayersMarks(){
    const tempDiv = playerMarkDivs[0].innerHTML;
    playerMarkDivs[0].innerHTML = playerMarkDivs[1].innerHTML;
    playerMarkDivs[1].innerHTML = tempDiv;
    playerMarkDivs[0].lastElementChild.textContent = "Player 1";
    playerMarkDivs[1].lastElementChild.textContent = "Player 2";
  }

  const showGameResult = (gameState, currentPlayer) => {
    if (gameState == "Tie"){
      gameResultDiv.textContent = "It's a Tie. Try Again!"
    }
    else if (gameState == "Finished"){
      gameResultDiv.textContent = `The winner is ${currentPlayer.getName()}!`
    }
    gameResultDiv.classList.toggle("visible-game-result");
  }

  const addCurrentMoveText = (currentPlayer) => {
      currentPlayerDiv.textContent = `${currentPlayer.getName()}`
    }

  const addNamesToInterface = (player1, player2) => {
      const matchupName = matchupHeader.querySelector("h2");
      const firstImg = playerMarkDivs[0].firstElementChild.cloneNode();
      const secondImg = playerMarkDivs[1].firstElementChild.cloneNode();
      firstImg.classList.add("matchup-img");
      secondImg.classList.add("matchup-img");
      matchupDivs[0].replaceChild(firstImg, matchupDivs[0].firstElementChild);
      matchupDivs[1].replaceChild(secondImg, matchupDivs[1].firstElementChild);
      matchupName.textContent = `${player1.getName()} vs ${player2.getName()}`
    }
  const publicAPI = {
    hideForms,
    clearResults,
    showGameResult,
    addCurrentMoveText,
    addNamesToInterface
  }

  return publicAPI;
})()

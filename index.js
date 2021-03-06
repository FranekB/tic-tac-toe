const computerAI = (() => {
  let computerMark = "X";

  function getEmptySquaresPositions(gameboard){
    let emptySquares = [];
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (gameboard[i][j] == ""){
          emptySquares.push([i,j]);
        }
      }
    }
    return emptySquares;
  }

  function setComputerMark(mark){
    computerMark = mark
  }
  function winning(gameboard, player){
   if (
   (gameboard[0][0] == player && gameboard[0][1] == player && gameboard[0][2] == player) ||
   (gameboard[1][0] == player && gameboard[1][1] == player && gameboard[1][2] == player) ||
   (gameboard[2][0] == player && gameboard[2][1] == player && gameboard[2][2] == player) ||
   (gameboard[0][0] == player && gameboard[1][0] == player && gameboard[2][0] == player) ||
   (gameboard[0][1] == player && gameboard[1][1] == player && gameboard[2][1] == player) ||
   (gameboard[0][2] == player && gameboard[1][2] == player && gameboard[2][2] == player) ||
   (gameboard[0][0] == player && gameboard[1][1] == player && gameboard[2][2] == player) ||
   (gameboard[2][0] == player && gameboard[1][1] == player && gameboard[0][2] == player)
   ) {
   return true;
   } else {
   return false;
   }
  }
  function getBestMove(gameboard, player, isMaximazing, depth){
    let emptySquares = getEmptySquaresPositions(gameboard);
    let playerMark;
    computerMark == "X" ? playerMark = "O" : playerMark = "X";
    if(winning(gameboard, computerMark)){
      return {score: 100 - depth}
    }
    else if(winning(gameboard, playerMark)){
      return {score: -100 + depth}
    }
    else if(emptySquares.length == 0){
      return {score: 0}
    }

    let moves = []
    let result;
    for(let square of emptySquares){
      let move = {}
      gameboard[square[0]][square[1]] = player;
      move.index = square
      if(player == playerMark){
        result = getBestMove(gameboard, computerMark, true, depth + 1)
        move.score = result.score
      }
      else if(player == computerMark){
        result = getBestMove(gameboard, playerMark, false, depth + 1)
        move.score = result.score
      }
      moves.push(move)
      gameboard[square[0]][square[1]] = "";
    }

    let bestMove = {}
    if(isMaximazing){
      bestMove.score = -1000;
      for(let move of moves){
        if (move.score > bestMove.score){
          bestMove.score = move.score
          bestMove.move = move.index
        }
      }
    }
    else{
      bestMove.score = 1000;
      for(let move of moves){
        if (move.score < bestMove.score){
          bestMove.score = move.score;
          bestMove.move = move.index
        }
      }
    }
    if (depth == 0){
      return bestMove.move
    }
    return bestMove
  }

  const publicAPI = {
    getBestMove,
    computerMark,
    setComputerMark
  }

  return publicAPI
})()






const playerFactory = (name, mark, markImg, isComputer) => {

  const getName = () => name;
  const getMark = () => mark;
  const getImg = () => markImg;
  const getIsComputer = () => isComputer;
  const makeMove = (position) =>{
    gameBoard.setSquare(position, mark)
  }
  return { getName, getMark, makeMove, getImg, getIsComputer };
}

const gameBoard = (() => {
  let _gameboard = [["", "", ""], ["", "", ""], ["", "", ""]];

  const clearGameBoard = () => {
    _gameboard = [["", "", ""], ["", "", ""], ["", "", ""]];
  }

  const isEmptySquare = (position) => {
    return _gameboard[position[0]][position[1]] == ""
  }
  const setSquare = (position, mark) => {
    _gameboard[position[0]][position[1]] = mark
  }

  const getState = () => gameState;

  function getEmptySquaresPositions(){
    let emptySquares = [];
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (isEmptySquare([i,j])){
          emptySquares.push([i,j]);
        }
      }
    }
    return emptySquares;
  }

  function getRandomEmptySquare(){
    let emptyPositions = getEmptySquaresPositions();
    let randomPosition = Math.floor((Math.random() * emptyPositions.length));
    return emptyPositions[randomPosition];
  }

  function getRows(){
    rows = []
    for(row of _gameboard){
      rows.push(row)
    }
  return rows
  }

  function getColumns(){
    let columns = [];
    for (let i = 0; i < 3; i++){
      let column = []
      for (let j = 0; j < 3; j++){
        column.push(_gameboard[j][i])
      }
      columns.push(column)
    }
    return columns;
  }

  function getDiagonals(){
    let firstDiagonal = []
    let secondDiagonal = []
    for (let i = 0; i < 3; i++){
      firstDiagonal.push(_gameboard[i][i])
      for (let j = 0; j < 3; j++){
        if(j == 2 - i){
          secondDiagonal.push(_gameboard[i][j])
        }
      }

    }
    return [firstDiagonal, secondDiagonal];
  }

  const isThreeInARow = () => {
    const winningPositions = ["X,X,X", "O,O,O"]
    const position = [getDiagonals(), getColumns(), getRows()].flat()
    return position.some(array => winningPositions.includes(array.join(",")))
  }

  const isAllMarksPlaced = () => {
    return !_gameboard.flat().includes("")
  }

  const getGameBoard = () => {
    return JSON.parse(JSON.stringify(_gameboard))
  }

  const publicAPI = {
      isEmptySquare,
      getGameBoard,
      clearGameBoard,
      setSquare,
      isThreeInARow,
      isAllMarksPlaced,
      getEmptySquaresPositions,
      getRandomEmptySquare
    };

  return publicAPI
})()


const game = (() => {
  let player1;
  let player2;
  let currentPlayer;

  //DOM Cache
  const resetButton = document.querySelector(".reset-btn-js");
  const startGameButton = document.querySelector(".start-btn-js");
  const playerNameInputs = document.querySelectorAll(".player-input-js");
  const gameboardDiv = document.querySelector(".gameboard-js");

  //BIND EVENTS
  gameboardDiv.addEventListener("click", makeMove)
  resetButton.addEventListener("click", restartGame)
  startGameButton.addEventListener("click", startGame)


  function createPlayers(){
    const marksImg = document.querySelectorAll(".mark-img-js");
    const player1Name = playerNameInputs[0].value || "Player 1";
    const player1Img = marksImg[0];
    const player2Img = marksImg[1];
    const gameType = displayController.getGameType();
    let player2AI = false;
    let player2Name = playerNameInputs[1].value || "Player 2";
    if (gameType == "computer"){
      player2AI = true;
      player2Name = "Computer";
    }
    player1 = playerFactory(player1Name, marksImg[0].getAttribute("alt"), player1Img, false);
    player2 = playerFactory(player2Name, marksImg[1].getAttribute("alt"), player2Img, player2AI);
    computerAI.setComputerMark(player2.getMark())
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
    displayController.clearGameBoardDiv();
    displayController.clearResults();
    displayController.addCurrentMoveText(currentPlayer);
  }


  //switches current player
  function switchCurrentPlayer(player){
    if (gameState != "Playing") return;
    currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1
    if (currentPlayer.getIsComputer()) computerMove();
  }

  function computerMove(){
    if (gameState != "Playing") return
      let bestMove = computerAI.getBestMove(gameBoard.getGameBoard(), player2.getMark(), true, 0);
      setTimeout( () => {
        currentPlayer.makeMove(bestMove)
        displayController.renderMove(bestMove, currentPlayer.getImg())
        isGameOver();
        switchCurrentPlayer()
        displayController.addCurrentMoveText(currentPlayer);
      }, 500)
  }

  //Adds mark of current player to the gameboard
  function makeMove(event){
    if (!event.target.classList.contains("gameboard-square")) return
    if (gameState != "Playing") return
    if (currentPlayer.getIsComputer() == true) return
    const squarePosition = Array.from(event.target.getAttribute("data-position"));
    if(gameBoard.isEmptySquare(squarePosition)){
      currentPlayer.makeMove(squarePosition);
      displayController.renderMove(squarePosition, currentPlayer.getImg());
      isGameOver();
      switchCurrentPlayer();
    }
    displayController.addCurrentMoveText(currentPlayer);
  }

  function isGameOver(){
    if (gameBoard.isThreeInARow()){
      gameState = "Finished"
      displayController.showGameResult(gameState, currentPlayer)
    }
    else if(gameBoard.isAllMarksPlaced()){
      gameState = "Tie"
      displayController.showGameResult(gameState, currentPlayer)
    }
  }
})()


const displayController = (() => {
  let gameType;
  //Store DOM
  const leftOptionsWrapper = document.querySelector(".wrapper-hidden");
  const bottomOptionsWrapper = document.querySelector(".hidden");
  const gameDiv = document.querySelector(".game-js");
  const opponentChoiceDiv = document.querySelector(".options-opponent-js");
  const gameOptionsDiv = document.querySelector(".game-options-js");
  const chooseOpponentButtons = document.querySelectorAll(".choose-opponent-js");
  const changeOptionsButton = document.querySelector("#change-options-js");
  const gameResultDiv = document.querySelector(".game-result-js");
  const currentPlayerDiv = document.querySelector("#current-move-js");
  const matchupDivs = document.querySelectorAll(".matchup-mark-js")
  const matchupHeader = document.querySelector(".matchup-js");
  const playerMarkDivs = document.querySelectorAll(".mark-div-js");
  const boardSquares = Array.from(document.querySelectorAll(".gameboard-square"));
  const player2Name = document.querySelector(".player2-js")
  //Bind Events

  for(const button of chooseOpponentButtons){
    button.addEventListener("click", () => {
      showBottomOptions();
      changeGameType();
    });
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
    gameOptionsDiv.classList.add("visible-bottom");
    bottomOptionsWrapper.style.width = "100%";
    if (event.target.textContent == "Computer"){
      player2Name.style.visibility = "hidden";
      playerMarkDivs[1].lastElementChild.textContent = "AI";
    }
    else {
      player2Name.style.visibility = "visible";
      playerMarkDivs[1].lastElementChild.textContent = "Player 2";
    }
  }

  function changeGameType(){
    if (event.target.classList.contains("computer-btn-js")) gameType = "computer";
    else{
      gameType = "player";
    }
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
    if (gameType == "computer") playerMarkDivs[1].lastElementChild.textContent = "Computer";
    else{
      playerMarkDivs[1].lastElementChild.textContent = "Player 2";
    }
  }

  const getGameType = () => gameType;
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
      const firstImg = player1.getImg().cloneNode();
      const secondImg = player2.getImg().cloneNode();
      firstImg.classList.add("matchup-img");
      secondImg.classList.add("matchup-img");
      matchupDivs[0].replaceChild(firstImg, matchupDivs[0].firstElementChild);
      matchupDivs[1].replaceChild(secondImg, matchupDivs[1].firstElementChild);
      matchupName.textContent = `${player1.getName()} vs ${player2.getName()}`
  }

  const renderMove = (squarePosition, markImg) => {
    const markImage = markImg.cloneNode();
    const movePosition = document.querySelector(`[data-position = "${squarePosition[0]}${squarePosition[1]}"]`)
    markImage.classList.add("gameboard-img");
    movePosition.appendChild(markImage);
  }

  const clearGameBoardDiv = () => {
    for (squares of boardSquares){
      squares.textContent = ""
    }
  }
  const publicAPI = {
    hideForms,
    clearResults,
    showGameResult,
    addCurrentMoveText,
    addNamesToInterface,
    renderMove,
    clearGameBoardDiv,
    getGameType
  }

  return publicAPI;
})()

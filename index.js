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
  let player1 = playerFactory("Player1", "X");
  let player2 = playerFactory("Player2", "O");
  let current_player = player1
  let gameState = "Playing"

  //DOM Cache
  let squares = Array.from(document.querySelectorAll(".gameboard-square"))

  //bind events
  for(square of squares){
    square.addEventListener("click", setMark)
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

  //renders gameboard on a screen
  function render(){
    if (gameBoard.isOver()) gameState = "Finished"
    else if(gameBoard.isAllMarksPlaced()) gameState = "Tie"
    console.log(gameState)
    let i = 0
    for(row of gameBoard.getGameBoard()){
      for(col of row){
        squares[i].textContent = col
        i += 1
      }
    }

  }
})()

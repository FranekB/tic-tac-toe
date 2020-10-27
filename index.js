const gameBoard = (() => {
  let gameboard = ["X", "X", "X", "X", "X", "X", "X", "X", "X"];

  const clearGameBoard = () => {
    gameboard = ["", "", "", "", "", "", "", "", ""];
  }

  const getSquare = (number) => {
    return gameboard[number]
  }
  const setSquare = (number, mark) => {
    gameboard[number] = mark
  }


  return {
    getSquare,
    clearGameBoard,
    setSquare
  };

})()



const playerFactory = (name, mark) => {

  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
}



const displayControler = (() => {
  let player1 = playerFactory("Player1", "X");
  let player2 = playerFactory("Player2", "O");
  let current_player = player1
  //DOM Cache
  let squares = Array.from(document.querySelectorAll(".gameboard-square"))

  //bind events
  for(square of squares){
    square.addEventListener("click", setMark)
  }

  function setMark(event){
    let squareNumber = (event.target.getAttribute("data"));
    gameBoard.setSquare(squareNumber, current_player.getMark())
    render(event.target, squareNumber)
  }

  function render(square, number){
    square.textContent = gameBoard.getSquare(number);
  }
})()

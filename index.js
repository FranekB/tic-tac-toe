const gameBoard = (() => {
  let gameboard = [["X", "X", "X"], ["O", "O", "O"], ["X", "X", "X"]];

  const getGameboard = () => gameboard;
  return {
    gameboard,
    getGameboard
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


  const init = () => {
    cacheDOM();
    render();
  }
  const cacheDOM = () => {
    gameboardContainer = document.querySelector(".gameboard")
    return gameboardContainer
  }

  const createSquareElement = (value) => {
    let element = document.createElement("div")
    element.classList.add("gameboard-square")
    element.textContent = value
    return element
  }

  const render = () => {
    for (rows of gameBoard.getGameboard()){
      for (cols of rows){
        gameboardContainer.appendChild(createSquareElement(cols));
      }
    }
  }

  init()


})()

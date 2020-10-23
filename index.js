const gameBoard = (() => {
  let gameboard = [["X", "X", "X"], ["O", "O", "X"], ["X", "O", "X"]];
  return { gameboard };
})()

const displayController = (() => {
  let state = "waiting"
  return { state }
})

const playerFactory = (name) => {
  let playerName = name || "Anonymous player";
  return { playerName };
}

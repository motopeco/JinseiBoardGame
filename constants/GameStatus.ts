const GameStatus = {
  Lobby: 0,
  Start: 1,
} as const

type GameStatus = typeof GameStatus[keyof typeof GameStatus]

export default GameStatus

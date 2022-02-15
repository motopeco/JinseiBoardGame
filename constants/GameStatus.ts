const GameStatus = {
  TurnStart: 0,
  RouletteShow: 1,
  RouletteTurning: 2,
  RouletteStopping: 3,
  RouletteStop: 4,
  PieceMove: 5,
  PieceCheck: 6,
  PieceResult: 7,
  TurnEnd: 8,
} as const

type GameStatus = typeof GameStatus[keyof typeof GameStatus]

export default GameStatus

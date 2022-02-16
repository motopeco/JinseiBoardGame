import GameStatus from '../../../constants/GameStatus'
import Ws from 'App/Services/Ws'
import SocketServerEvent from '../../../constants/SocketServerEvent'
import Room from 'App/Models/Room'
import Event from '@ioc:Adonis/Core/Event'

export default class GameProcess {
  private isPause = false
  public get pause(): boolean {
    return this.isPause
  }

  private userId: number
  private roomId: number
  private roomKey: string
  private gameData: GameData
  private angle: number = 0
  private anglePlusAmount: number = 10
  private timer: NodeJS.Timer
  /**
   * ルーレットの値
   * @private
   */
  private rouletteAmount = 0
  /**
   * 移動値（計算用）
   * @private
   */
  private moveAmount = 0

  public async next(userId: number, roomId: number, gameData: GameData) {
    if (this.isPause) return gameData

    this.userId = userId
    this.roomId = roomId
    this.roomKey = `room${roomId}`
    this.gameData = gameData
    this.isPause = true

    switch (gameData.status) {
      case GameStatus.TurnStart:
        this.turnStart()
        break
      case GameStatus.RouletteShow:
        this.rouletteShow()
        break
      case GameStatus.RouletteTurning:
        await this.rouletteTurning()
        break
      case GameStatus.RouletteStopping:
        this.rouletteStopping()
        break
      case GameStatus.RouletteStop:
        this.rouletteStop()
        break
      case GameStatus.PieceMove:
        await this.pieceMove()
        break
      case GameStatus.PieceCheck:
        await this.pieceCheck()
        break
      case GameStatus.PieceResult:
        await this.pieceResult()
        break
      case GameStatus.TurnEnd:
        this.turnEnd()
        break
    }

    return this.gameData
  }

  private turnStart() {
    const data: SocketServerData.ShowTurnInfoResult = {
      message: '',
    }
    Ws.io.to(this.roomKey).emit(SocketServerEvent.ShowTurnInfo, data)
    this.gameData.status = GameStatus.RouletteShow

    this.isPause = false
  }

  private rouletteShow() {
    const hideTurnInfoResult: SocketServerData.HideTurnInfoResult = {}
    Ws.io.to(this.roomKey).emit(SocketServerEvent.HideTurnInfo, hideTurnInfoResult)

    const showRouletteResult: SocketServerData.ShowRouletteResult = {}
    Ws.io.to(this.roomKey).emit(SocketServerEvent.ShowRoulette, showRouletteResult)

    this.gameData.status = GameStatus.RouletteTurning

    this.isPause = false
  }

  private async rouletteTurning() {
    this.timer = setInterval(() => {
      this.angle += this.anglePlusAmount
      if (this.angle >= 360) this.angle = 0

      const result: SocketServerData.UpdateRouletteResult = { angle: this.angle }
      Ws.io.to(this.roomKey).emit(SocketServerEvent.UpdateRoulette, result)
    }, 500)

    await this.sleep(2000)
    this.gameData.status = GameStatus.RouletteStopping
    this.isPause = false
  }

  private rouletteStopping() {
    const stopTimer = setInterval(async () => {
      this.anglePlusAmount--
      if (this.anglePlusAmount === 0) {
        clearInterval(this.timer)
        clearInterval(stopTimer)
        this.gameData.status = GameStatus.RouletteStop
        this.isPause = false

        await Room.query().where('id', this.roomId).update({ gameData: this.gameData })
        await Event.emit('notification', this.roomId)
      }
    }, 250)
  }

  private rouletteStop() {
    // 時計回り 9, 8, 7 ... 1 の順番で回転するので 9から計算値を減算
    this.rouletteAmount = 9 - Math.floor(this.angle / 40)
    this.moveAmount = this.rouletteAmount

    this.angle = 0
    this.anglePlusAmount = 20

    const result: SocketServerData.HideRouletteResult = {}
    Ws.io.to(this.roomKey).emit(SocketServerEvent.HideRoulette, result)

    this.gameData.status = GameStatus.PieceMove
    this.isPause = false
  }

  private async pieceMove() {
    const userIndex = this.gameData.players.findIndex((p) => p.playerId === this.userId)
    if (userIndex < 0) {
      // error
      return
    }

    const user = this.gameData.players[userIndex]

    const currentMassIndex = this.gameData.gameMap.board.findIndex(
      (map) => map.x === user.x && map.y === user.y
    )
    if (currentMassIndex < 0) {
      // error
      return
    }

    const currentMass = this.gameData.gameMap.board[currentMassIndex]

    await this.sleep(1000)

    let nextMass = this.gameData.gameMap.board[currentMassIndex + 1]
    if (!nextMass) {
      nextMass = this.gameData.gameMap.board[0]
    }

    user.x = nextMass.x
    user.y = nextMass.y
    this.moveAmount--
    this.gameData.players[userIndex] = user

    const result: SocketServerData.MovePieceResult = {
      userId: user.playerId,
      x: user.x,
      y: user.y,
    }

    this.gameData.status = GameStatus.PieceCheck

    Ws.io.to(this.roomKey).emit(SocketServerEvent.MovePiece, result)

    await this.sleep(1000)
    await this.pieceCheck()
  }

  private async pieceCheck() {
    const userIndex = this.gameData.players.findIndex((p) => p.playerId === this.userId)
    if (userIndex < 0) {
      // error
      return
    }

    const user = this.gameData.players[userIndex]

    const currentMassIndex = this.gameData.gameMap.board.findIndex(
      (map) => map.x === user.x && map.y === user.y
    )
    if (currentMassIndex < 0) {
      // error
      return
    }

    const currentMass = this.gameData.gameMap.board[currentMassIndex]

    if (currentMass.isStop || this.moveAmount === 0) {
      this.gameData.status = GameStatus.PieceResult
      await this.pieceResult()
      return
    }

    this.gameData.status = GameStatus.PieceMove
    await this.pieceMove()
  }

  private async pieceResult() {
    const result: SocketServerData.ShowMessageResult = {
      message: '',
    }
    Ws.io.emit(SocketServerEvent.ShowMessage, result)

    this.gameData.status = GameStatus.TurnEnd
    this.isPause = false
  }

  private turnEnd() {
    const result: SocketServerData.HideMessageResult = {}
    Ws.io.emit(SocketServerEvent.HideMessage, result)

    const userIndex = this.gameData.players.findIndex((p) => p.playerId === this.userId)
    if (userIndex < 0) {
      // error
      return
    }

    const user = this.gameData.players[userIndex]
    let nextUser = this.gameData.players.find((p) => p.turnIndex === user.turnIndex + 1)
    if (!nextUser) {
      nextUser = this.gameData.players.find((p) => p.turnIndex === 0)
    }

    if (!nextUser) return

    this.gameData.turnPlayer = nextUser.playerId
    this.gameData.status = GameStatus.TurnStart
    this.gameData.turnNumber++

    this.rouletteAmount = 0
    this.angle = 0
    this.moveAmount = 0

    this.isPause = false
  }

  private async sleep(num) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, num)
    })
  }
}

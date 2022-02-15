import GameStatus from '../../../constants/GameStatus'
import Ws from 'App/Services/Ws'
import SocketServerEvent from '../../../constants/SocketServerEvent'
import Room from 'App/Models/Room'
import Event from '@ioc:Adonis/Core/Event'

export default class GameProcess {
  private isPause = false
  private userId: number
  private roomId: number
  private roomKey: string
  private gameData: GameData
  private angle: number = 0
  private anglePlusAmount: number = 10
  private timer: NodeJS.Timer

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
        this.pieceMove()
        break
      case GameStatus.PieceCheck:
        this.pieceCheck()
        break
      case GameStatus.PieceResult:
        this.pieceResult()
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
    this.angle = 0
    this.anglePlusAmount = 20

    const result: SocketServerData.HideRouletteResult = {}
    Ws.io.to(this.roomKey).emit(SocketServerEvent.HideRoulette, result)

    this.gameData.status = GameStatus.PieceMove
    this.isPause = false
  }

  private pieceMove() {}

  private pieceCheck() {}

  private pieceResult() {}

  private turnEnd() {}

  private async sleep(num) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, num)
    })
  }
}
